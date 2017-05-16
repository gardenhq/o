Feature: YAML Container/Service files
  Background:
    Given I am on "/"
    And I am on "/examples/b/yaml/#clear"
    And I am on "/"
  @javascript
  Scenario: It can load up a YAML service/container file
    Given I am on "/examples/b/yaml/index.html"
    Then I execute "sleep 2"
    Then I should see "Hello World!"

  @javascript
  Scenario: It can run the bundled script
    Given I am on "/examples/b/yaml/#bundle"
    Then I execute "sleep 1"
    And save the html in "pre" to "yaml-bundled.js"
