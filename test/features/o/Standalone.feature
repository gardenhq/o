Feature: Standalone (i.e. built /o.js not src/o.js)
  Background:
    Given I am on "/"
    And I am on "/test/fixtures/o/standalone/development.html#clear"
    And I am on "/"
  @javascript
  Scenario: It can import from inline <script> elements
    Given I am on "/test/fixtures/o/standalone/inline.html"
    Then I should see "Hello World!"

  @javascript
  Scenario: It can import within external scripts
    Given I am on "/test/fixtures/o/standalone/external.html"
    Then I should see "Hello World! (from o/external.js)"

  @javascript
  Scenario: It can import within external scripts using a `data-src` path ready for bundling
    Given I am on "/test/fixtures/o/standalone/development.html"
    And I execute "sleep 2"
    Then I should see "Hello World! (from o/external.js)"

  @javascript
  Scenario: It produces a bundle without 'willow' (and therefore not the toolbar)
    Given I am on "/test/fixtures/o/standalone/development.html#bundle"
    Then I execute "sleep 2"
    And save the html in "pre" to "bundled.js"
    Then I execute "grep -c 'willow' ./test/results/bundled.js"
    And I should see the output "0"

  @javascript
  Scenario: It can run the bundled script
    Given I am on "/test/fixtures/o/standalone/development.html#bundle"
    Then I execute "sleep 2"
    And save the html in "pre" to "bundled.js"

    Given I execute "make report /test/fixtures/o/standalone/development.html"
    Then print the last error output
    Then print the last output

    Given I am on "/test/fixtures/bundled/index.html"
    Then I should see "Hello World! (from o/external.js) Hello World! (from o/external.js)"
