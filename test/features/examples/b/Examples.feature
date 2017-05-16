Feature: Examples
  Background:
    Given I am on "/"
    And I am on "/examples/b/development.html#clear"
    And I am on "/"

  @javascript
  Scenario: It can import from inline <script> elements
    Given I am on "/examples/b/inline.html"
    Then I should see "Hello World!"

  @javascript
  Scenario: It can import within external scripts
    Given I am on "/examples/b/external.html"
    Then I should see "Hello World!"

  @javascript
  Scenario: It can import within external scripts using a `data-src` path ready for bundling
    Given I am on "/examples/b/development.html"
    And I execute "sleep 2"
    Then I should see "Hello World!"


  @javascript
  Scenario: It can run the bundled script
    Given I am on "/examples/b/development.html#bundle"
    Then I execute "sleep 1"
    And save the html in "pre" to "b-bundled.js"
