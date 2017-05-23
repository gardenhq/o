export PATH := ./node_modules/.bin:${PATH}
ARGUMENTS := $(wordlist 2,$(words $(MAKECMDGOALS)),$(MAKECMDGOALS))
FILES=parser/eval.js parser/evalSync.js parser/function.js parser/script.js registry/memory.js transport/xhr.js transport/xhrNodeResolver.js transport/iframe.js proxy/localStorage.js b.js
clean:
	rm -rf $(FILES) \
			o.js o.dev.js \
			./src/dev/oMaximal.js ./src/dev/oDev.js \
			./dev 
%.min.js: %.js
	@uglifyjs --screw-ie8 --mangle --compress sequences=true,booleans=true,join_vars=true -o $@ $*.js
	@printf "Uglified+gz : %d bytes\n" $$(cat $@ | gzip | wc -c)
%.js:
	@uglifyjs --screw-ie8 --mangle --compress sequences=true,booleans=true,join_vars=true -o $@ ./src/$@
	@printf "$@: "
	@cat $@ | gzip | wc -c

report: 
	@mv ./test/results/bundled.js ./test/fixtures/bundled/bundled.js
	@cp ./test/fixtures/bundled/bundled.js ./test/fixtures/bundled/sub/bundled.js
	@echo "# Url: $(ARGUMENTS)"
	@ls -al ./test/fixtures/bundled/bundled.js | awk '{ print "$(ARGUMENTS) Raw " $$5}' | ./test/report
	@$(MAKE) ./test/fixtures/bundled/bundled.min.js | awk '{ print "$(ARGUMENTS) " $$1 " " $$3}' | ./test/report
	@ls -al ./test/fixtures/bundled/bundled.min.js | awk '{ print "$(ARGUMENTS) Uglified " $$5}' | ./test/report
    
build: clean $(FILES);
	@cp -R src/dev ./dev
	# Build
	@./bin/o.js > ./src/o.max.js
	# @./bin/o.js --configurable > ./src/o.dev.js
	@./bin/o.js --proxy @gardenhq/o@5.1.0/dev/index.js > ./src/o.dev.js 
	# Uglify
	@$(MAKE) o.max.js
	@$(MAKE) o.dev.js
	# Move templates into place
	@mv ./src/o.max.js ./src/dev/oMaximal.js
	# @mv ./src/o.dev.js ./src/dev/oDev.js
	# Move max (which is now minned) to o.js
	@mv o.max.js o.js
	# @mv o.dev.js ./src/dev/o.js
	@echo "-----"
	# Report
	@echo "# o.js"
	@ls -al o.js | awk '{ print $$9 " Uglified " $$5}' | METRICS=127.0.0.1 ./test/report
	@printf "o.js Uglified+gz %d" $$(cat o.js | gzip | wc -c) | METRICS=127.0.0.1 ./test/report
	@echo "# o.dev.js"
	@ls -al o.dev.js | awk '{ print $$9 " Uglified " $$5}' | METRICS=127.0.0.1 ./test/report
	@printf "o.dev.js Uglified+gz %d" $$(cat ./o.dev.js | gzip | wc -c) | METRICS=127.0.0.1 ./test/report
#$(eval $(ARGUMENTS):;@:)
