# HW04: Unit Testing for `addFurniture` Functionality

---

## **Overview**

This folder contains the unit tests for the **`addFurniture`** functionality in the `SquareRoom` component of the app. The tests are designed to ensure that the logic for adding furniture items to the app’s state is correct and robust against various edge cases.

---

## **Test File**

### File: `FurnitureTest.test.ts`

The unit tests for the `addFurniture` function are located in `app/tests/FurnitureTest.test.ts`. These tests evaluate:
1. **Basic Functionality**: Ensuring new furniture items are correctly added to the state.
2. **Edge Cases**: Verifying behavior when invalid inputs are provided.
3. **Duplicate Handling**: Preventing duplicate furniture items from being added.
4. **Custom Initial Position**: Supporting furniture items with specific custom positions.
5. **Large State Handling**: Confirming the function works with large existing state arrays.

---

## **How the Tests Work**

The tests use the following approach:

1. **Mocking `setFurnitureItems`**:
   - A mock function is used to simulate the state-updating behavior of React’s `useState`.

2. **Defining and Testing the `addFurniture` Logic**:
   - The function creates a new furniture item and updates the state array.
   - Tests simulate calling this function and verify the behavior of the mock function and the resulting state.

3. **Simulating State Updates**:
   - The mock function captures the callback used to update state.
   - The tests run this callback with various scenarios (e.g., existing items, invalid inputs) to validate the function.

---

## **Key Tests**

### 1. **Basic Functionality**
Ensures a new furniture item is added with default properties:
- **Inputs**: Name, image, and a mock state function.
- **Expected Outcome**: A new item appears in the state with the correct `name`, `image`, and default `position`.

### 2. **Invalid Inputs**
Verifies that the function does not add items when:
- **Name** or **image** is missing.

### 3. **Prevent Duplicates**
Tests that duplicate furniture items are not added:
- Checks for existing items with the same `name`.

### 4. **Custom Initial Positions**
Tests adding furniture items with specific positions:
- **Inputs**: Custom `position`.
- **Expected Outcome**: The item appears in the state with the provided `position`.

### 5. **Large State Handling**
Confirms that the function works efficiently with a large number of existing items:
- **Inputs**: A state array with 100+ items.
- **Expected Outcome**: The new item is appended correctly without performance issues.

---

## **How to Run the Tests**

1. **Install Dependencies**
   Ensure the necessary testing dependencies are installed:
   ```bash
   npm install
