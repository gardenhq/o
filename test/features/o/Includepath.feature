Feature: Basepath
  # Background:
  #   Given I am on "/"
  #   And I am on "/test/fixtures/o/includepath/#clear"
  #   And I am on "/"
  @javascript
  Scenario: It can import within inline scripts, with an includepath set on the inline tag
    Given I am on "/test/fixtures/o/includepath/inline.html"
    And I should see "Hello World! (using a ../../ relative path)"
