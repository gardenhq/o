Feature: Examples
  Background:
    Given I am on "/"
    And I am on "/examples/o/development.html#clear"
    And I am on "/"
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
    Given I am on "/examples/o/development.html#bundle"
    Then I execute "sleep 2"
    And save the html in "pre" to "o-bundled.js"
    Then I execute "grep -c 'willow' ./test/results/o-bundled.js"
    And I should see the output "0"

  @javascript
  Scenario: It can run the bundled script
    Given I am on "/examples/o/development.html#bundle"
    Then I execute "sleep 2"
    And save the html in "pre" to "bundled.js"

    # And I execute "cp ./test/results/bundled.js ./examples/o/bundled.js"
    # And I execute "chown 1000:1000 ./examples/o/bundled.js"

    Given I execute "make report /examples/o/development.html"
    Then print the last error output
    Then print the last output

    Given I am on "/test/fixtures/bundled/index.html"
    Then I should see "Hello World! Hello World!"
