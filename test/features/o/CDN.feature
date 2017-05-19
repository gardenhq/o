Feature: CDN
  Background:
    Given I am on "/"
    And I am on "/test/fixtures/o/cdn/development.html#clear"
    And I am on "/"
  @javascript
  Scenario: During development I can use a basepath plus a data-src path
    Given I am on "/test/fixtures/o/cdn/development.html"
    And I execute "sleep 3"
    Then I should see "Hello World! (from o/external.js)"

  @javascript
  Scenario: It can run the bundled script
    Given I am on "/test/fixtures/o/cdn/development.html#bundle"
    Then I execute "sleep 2"
    And save the html in "pre" to "bundled.js"

    Given I execute "make report /test/fixtures/o/cdn/development.html"
    Then print the last error output
    Then print the last output

    Given I am on "/test/fixtures/bundled/index.html"
    Then I should see "Hello World! (from o/external.js) Hello World! (from o/external.js)"
