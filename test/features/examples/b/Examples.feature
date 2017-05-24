Feature: Examples
  Background:
    Given I am on "/"
    And I am on "/examples/b/development.html#clear"
    And I am on "/"

  @javascript
  Scenario: It can import from inline <script> elements
    Given I am on "/examples/b/inline.html"
    And I execute "sleep 3"
    Then I should see "Hello World!"

  @javascript
  Scenario: It can import within external scripts
    Given I am on "/examples/b/external.html"
    And I execute "sleep 3"
    Then I should see "Hello World!"

  @javascript
  Scenario: It can import within external scripts using a `data-src` path ready for bundling
    Given I am on "/examples/b/development.html"
    And I execute "sleep 3"
    Then I should see "Hello World!"


  @javascript
  Scenario: It can run the bundled script
    Given I am on "/examples/b/development.html"
    And I execute "sleep 3"
    Then I should see "Hello World!"
    And I am on "/"
    Given I am on "/examples/b/development.html#bundle"
    Then I execute "sleep 3"
    And save the html in "pre" to "bundled.js"

    Given I execute "make report /examples/b/development.html"
    Then print the last error output
    Then print the last output

    Given I am on "/test/fixtures/bundled/index.html"
    Then I execute "sleep 3"
    Then I should see "Hello World! Hello World!"
