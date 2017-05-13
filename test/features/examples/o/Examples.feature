Feature: Examples
  @javascript
  Scenario: It can import from inline <script> elements
    Given I am on "/examples/o/inline.html"
    Then I should see "Hello World!"

  @javascript
  Scenario: It can import within external scripts
    Given I am on "/examples/o/external.html"
    Then I should see "Hello World!"

  @javascript
  Scenario: It can import within external scripts using a `data-src` path ready for bundling
    Given I am on "/examples/o/development.html"
    And I execute "sleep 2"
    Then I should see "Hello World!"

  @javascript
  Scenario: It produces a bundle without 'willow' (and therefore not the toolbar)
    Given I am on "/"
    Then I am on "/examples/o/development.html#bundle"
    Then I execute "sleep 1"
    And save the html in "pre" to "o-bundled.js"
    Then I execute "grep -c 'willow' ./test/results/o-bundled.js"
    And I should see the output "0"
