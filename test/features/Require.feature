Feature: Require
  Background:
    Given I am on "/"
    And I am on "/test/fixtures/o/require/local/development.html#clear"
    And I am on "/"

  @javascript
  Scenario: I should be able to 'require' inline
    Given I am on "/test/fixtures/o/require/local/inline.html"
    And I execute "sleep 3"
    Then I should see "Hello World!"

  @javascript
  Scenario: It can run the bundled script
    Given I am on "/test/fixtures/o/require/local/development.html#bundle"
    Then I execute "sleep 3"
    And save the html in "pre" to "bundled.js"
    # TODO: Seems like largish files end up with trailing html, cut off for now
    # And I execute "mv ./test/results/bundled.js ./test/fixtures/bundled/bundled.js"
    And I execute "head -n -1 ./test/results/bundled.js > ./test/fixtures/bundled/bundled.js"
    And I execute "cp ./test/fixtures/bundled/bundled.js ./test/fixtures/bundled/sub/bundled.js"
    Then I am on "/test/fixtures/bundled/index.html"
    Then I should see "Hello World! Hello World!"
