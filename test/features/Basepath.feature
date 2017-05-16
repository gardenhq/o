Feature: Basepath
  Background:
    Given I am on "/"
    And I am on "/test/fixtures/o/basepath/development/basepath.html#clear"
    And I am on "/"
  @javascript
  Scenario: It can import within inline scripts, optionally setting the basepath
    Given I am on "/test/fixtures/o/basepath/inline.html"
    Then I should see "Hello World! From o/basepath/sub/hello-world.js (using a ./ relative path with a basepath set)"
    And I should see "Hello World! (using a ../../ relative path)"

  @javascript
  Scenario: It can import within external scripts, optionally setting the basepath
    Given I am on "/test/fixtures/o/basepath/external.html"
    Then I should see "Hello World! (from o/external.js)"
    And I should see "Hello World! From o/basepath/sub/hello-world.js (from o/external.js)"
    And I should see "Hello World! From o/basepath/sub/hello-world.js (from o/basepath/sub/external.js)"
    And I should see "Hello World! (from o/basepath/sub/external.js)"

  @javascript
  Scenario: During development I can use a relative data-src path
    Given I am on "/test/fixtures/o/basepath/development/relative.html"
    And I execute "sleep 1"
    Then I should see "Hello World! (from o/external.js)"

  @javascript
  Scenario: During development I can use a basepath plus a data-src path
    Given I am on "/test/fixtures/o/basepath/development/basepath.html"
    And I execute "sleep 1"
    Then I should see "Hello World! (from o/external.js)"

  @javascript
  Scenario: It can run the bundled script
    Given I am on "/test/fixtures/o/basepath/development/basepath.html#bundle"
    Then I execute "sleep 1"
    And save the html in "pre" to "bundled.js"
    And I execute "mv ./test/results/bundled.js ./test/fixtures/bundled/bundled.js"
    And I execute "cp ./test/fixtures/bundled/bundled.js ./test/fixtures/bundled/sub/bundled.js"
    Then I am on "/test/fixtures/bundled/index.html"
    Then I should see "Hello World! (from o/external.js) Hello World! (from o/external.js)"
