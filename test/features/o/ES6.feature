Feature: ES6
  Background:
    Given I am on "/"
    And I am on "/test/fixtures/o/es6/development.html#clear"
    And I am on "/"

  @javascript
  Scenario: It can run the bundled script
    Given I am on "/test/fixtures/o/es6/development.html"
    Then I execute "sleep 5"
    Then I should see "Hello World!"

    And I am on "/"
    Then I am on "/test/fixtures/o/es6/development.html#bundle"
    And I execute "sleep 3"

    And save the html in "pre" to "bundled.js"

    Given I execute "make report /test/fixtures/o/es6/development.html"
    Then print the last error output
    Then print the last output

    Given I am on "/test/fixtures/bundled/index.html"
    And I execute "sleep 3"
    Then I should see "Hello World! Hello World!"
