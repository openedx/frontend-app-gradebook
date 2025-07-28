import React from "react";
import { render, screen, initializeMocks } from "testUtilsExtra";

import HistoryHeader from "./HistoryHeader";

jest.unmock("@openedx/paragon");
jest.unmock("react");
jest.unmock("@edx/frontend-platform/i18n");

initializeMocks();

describe("HistoryHeader", () => {
  const defaultProps = {
    id: "test-id",
    label: "Test Label",
    value: "Test Value",
  };

  it("renders header with label and value", () => {
    render(<HistoryHeader {...defaultProps} />);

    expect(screen.getByText("Test Label:")).toBeInTheDocument();
    expect(screen.getByText("Test Value")).toBeInTheDocument();
  });

  it("renders header element with correct classes", () => {
    render(<HistoryHeader {...defaultProps} />);

    const headerElement = screen.getByText("Test Label:");
    expect(headerElement).toHaveClass("grade-history-header");
    expect(headerElement).toHaveClass("grade-history-test-id");
  });

  it("renders with string value", () => {
    const props = {
      ...defaultProps,
      value: "String Value",
    };

    render(<HistoryHeader {...props} />);
    expect(screen.getByText("String Value")).toBeInTheDocument();
  });

  it("renders with number value", () => {
    const props = {
      ...defaultProps,
      value: 85,
    };

    render(<HistoryHeader {...props} />);
    expect(screen.getByText("85")).toBeInTheDocument();
  });

  it("renders with null value (default prop)", () => {
    const props = {
      id: "test-id",
      label: "Test Label",
    };

    render(<HistoryHeader {...props} />);
    expect(screen.getByText("Test Label:")).toBeInTheDocument();

    const valueDiv = screen.getByText("Test Label:").nextSibling;
    expect(valueDiv).toBeInTheDocument();
    expect(valueDiv).toBeEmptyDOMElement();
  });

  it("renders with React node as label", () => {
    const props = {
      ...defaultProps,
      label: <strong>Bold Label</strong>,
    };

    render(<HistoryHeader {...props} />);
    const strongElement = screen.getByText("Bold Label");
    expect(strongElement.tagName).toBe("STRONG");
  });

  it("generates correct class name based on id", () => {
    const props = {
      ...defaultProps,
      id: "assignment-name",
    };

    render(<HistoryHeader {...props} />);
    const headerElement = screen.getByText("Test Label:");
    expect(headerElement).toHaveClass("grade-history-assignment-name");
  });

  it("renders container structure correctly", () => {
    render(<HistoryHeader {...defaultProps} />);

    const headerElement = screen.getByText("Test Label:");
    const valueElement = screen.getByText("Test Value");

    expect(headerElement).toBeInTheDocument();
    expect(valueElement).toBeInTheDocument();

    expect(headerElement).toHaveClass(
      "grade-history-header",
      "grade-history-test-id"
    );
  });
});
