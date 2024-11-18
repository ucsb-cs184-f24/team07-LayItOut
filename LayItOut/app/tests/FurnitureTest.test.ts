describe('addFurniture functionality', () => {
    it('adds a new furniture item to the state', () => {
      // Define the addFurniture function here
      const addFurniture = (name: string, image: string, setFurnitureItems: Function) => {
        const newItem = { name, image, position: { x: 20, y: 20 } };
        setFurnitureItems((prevItems: any[]) => [...prevItems, newItem]);
      };
  
      // Mock the setFurnitureItems function
      const setFurnitureItemsMock = jest.fn();
  
      // Call addFurniture
      addFurniture('chair', 'chair_image_mock', setFurnitureItemsMock);
  
      // Ensure setFurnitureItemsMock is called with a function
      expect(setFurnitureItemsMock).toHaveBeenCalledWith(expect.any(Function));
  
      // Simulate the updater function to verify the final state
      const prevItems: never[] = [];
      const updaterFunction = setFurnitureItemsMock.mock.calls[0][0];
      const updatedItems = updaterFunction(prevItems);
  
      // Assert that the state includes the new furniture item
      expect(updatedItems).toEqual([
        { name: 'chair', image: 'chair_image_mock', position: { x: 20, y: 20 } },
      ]);
    });
  });
  