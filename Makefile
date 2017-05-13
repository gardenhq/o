export PATH := ./node_modules/.bin:${PATH}
FILES=parser/eval.js parser/evalSync.js parser/function.js parser/script.js registry/memory.js transport/xhr.js transport/xhrNodeResolver.js transport/iframe.js proxy/localStorage.js
clean:
	rm -rf $(FILES) o.js ./b.js ./src/dev/o.js ./src/o.dev.js ./src/dev/oMaximal.js ./src/dev/oDev.js ./dev 
%.min.js: %.js
	@uglifyjs --screw-ie8 --mangle --compress sequences=true,booleans=true,join_vars=true -o $@ $*.js
	@printf "Minned '$@': (%d bytes)\n" $$(cat $@ | gzip | wc -c)
%.js:
	@uglifyjs --screw-ie8 --mangle --compress sequences=true,booleans=true,join_vars=true -o $@ ./src/$@
	@printf "$@: "
	@cat $@ | gzip | wc -c
build: clean $(FILES);
	# Build
	@./bin/o.js > ./src/o.max.js
	@./bin/o.js --configurable > ./src/o.dev.js
	# Uglify
	@$(MAKE) o.max.js
	@$(MAKE) o.dev.js
	# Move into place
	@mv ./src/o.max.js ./src/dev/oMaximal.js
	@mv ./src/o.dev.js ./src/dev/oDev.js
	@mv o.max.js o.js
	@mv o.dev.js ./src/dev/o.js
	@cp -R src/dev ./dev
	@echo "-----"
	# Report
	@printf "Non-configurable: o.js  (%d bytes)\n" $$(cat o.js | gzip | wc -c)
	@printf "Configurable: ./dev/o.js  (%d bytes)\n" $$(cat ./dev/o.js | gzip | wc -c)
