Feature: YAML Container/Service files
  Background:
    Given I am on "/"
    And I am on "/test/fixtures/examples/yaml/#clear"
    And I am on "/"
  @javascript
  Scenario: It can load up a YAML service/container file
    Given I am on "/test/fixtures/examples/yaml/index.html"
    Then I execute "sleep 5"
    Then I should see "Hello World!"

  @javascript
  Scenario: It can run the bundled script
    Given I am on "/test/fixtures/examples/yaml/"
    And I execute "sleep 3"
    Then I should see "Hello World!"
    And I am on "/"
    Given I am on "/test/fixtures/examples/yaml/#bundle"
    Then I execute "sleep 3"
    And save the html in "pre" to "bundled.js"

    Given I execute "make report /test/fixtures/examples/yaml/index.html"
    Then print the last error output
    Then print the last output

    Given I am on "/test/fixtures/bundled/index.html"
    Then I execute "sleep 3"
    Then I should see "Hello World! Hello World!"
