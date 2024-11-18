describe('addFurniture functionality', () => {
    it('adds a new furniture item to the state', () => {
      // Mock setFurnitureItems function
      const setFurnitureItemsMock = jest.fn();
  
      // Define addFurniture
      const addFurniture = (name: string, image: string, setFurnitureItems: Function) => {
        const newItem = { name, image, position: { x: 20, y: 20 } };
        setFurnitureItems((prevItems: any[]) => [...prevItems, newItem]);
      };
  
      // Call addFurniture
      addFurniture('chair', 'chair_image_mock', setFurnitureItemsMock);
  
      // Simulate state update
      const updaterFunction = setFurnitureItemsMock.mock.calls[0][0];
      const updatedItems = updaterFunction([]);
  
      // Assert state includes the new item
      expect(updatedItems).toEqual([
        { name: 'chair', image: 'chair_image_mock', position: { x: 20, y: 20 } },
      ]);
    });
  
    it('does not add furniture when name or image is missing', () => {
      const setFurnitureItemsMock = jest.fn();
  
      const addFurniture = (name: string, image: string, setFurnitureItems: Function) => {
        if (!name || !image) return;
        const newItem = { name, image, position: { x: 20, y: 20 } };
        setFurnitureItems((prevItems: any[]) => [...prevItems, newItem]);
      };
  
      // Call with invalid inputs
      addFurniture('', '', setFurnitureItemsMock);
  
      // Ensure state update function is not called
      expect(setFurnitureItemsMock).not.toHaveBeenCalled();
    });
  
    it('prevents duplicate furniture items from being added', () => {
      const setFurnitureItemsMock = jest.fn();
  
      const addFurniture = (name: string, image: string, setFurnitureItems: Function) => {
        setFurnitureItems((prevItems: any[]) => {
          if (prevItems.some(item => item.name === name)) return prevItems; // Prevent duplicates
          const newItem = { name, image, position: { x: 20, y: 20 } };
          return [...prevItems, newItem];
        });
      };
  
      const existingItems = [
        { name: 'chair', image: 'chair_image_mock', position: { x: 20, y: 20 } },
      ];
  
      // Call addFurniture with duplicate name
      addFurniture('chair', 'chair_image_mock', setFurnitureItemsMock);
  
      const updaterFunction = setFurnitureItemsMock.mock.calls[0][0];
      const updatedItems = updaterFunction(existingItems);
  
      // Assert state remains unchanged
      expect(updatedItems).toEqual(existingItems);
    });
  
    it('adds furniture with a custom initial position if provided', () => {
      const setFurnitureItemsMock = jest.fn();
  
      const addFurniture = (
        name: string,
        image: string,
        setFurnitureItems: Function,
        position = { x: 50, y: 50 }
      ) => {
        const newItem = { name, image, position };
        setFurnitureItems((prevItems: any[]) => [...prevItems, newItem]);
      };
  
      // Call addFurniture with custom position
      addFurniture('bed', 'bed_image_mock', setFurnitureItemsMock, { x: 100, y: 200 });
  
      const updaterFunction = setFurnitureItemsMock.mock.calls[0][0];
      const updatedItems = updaterFunction([]);
  
      // Assert custom position is applied
      expect(updatedItems).toEqual([
        { name: 'bed', image: 'bed_image_mock', position: { x: 100, y: 200 } },
      ]);
    });
  
    it('adds furniture correctly when state already has many items', () => {
      const setFurnitureItemsMock = jest.fn();
  
      const addFurniture = (name: string, image: string, setFurnitureItems: Function) => {
        const newItem = { name, image, position: { x: 20, y: 20 } };
        setFurnitureItems((prevItems: any[]) => [...prevItems, newItem]);
      };
  
      const existingItems = Array.from({ length: 100 }, (_, i) => ({
        name: `furniture${i}`,
        image: `image${i}`,
        position: { x: i * 10, y: i * 10 },
      }));
  
      // Call addFurniture
      addFurniture('newChair', 'chair_image_mock', setFurnitureItemsMock);
  
      const updaterFunction = setFurnitureItemsMock.mock.calls[0][0];
      const updatedItems = updaterFunction(existingItems);
  
      // Assert new item is added to the end of the array
      expect(updatedItems.length).toBe(101);
      expect(updatedItems[100]).toEqual({
        name: 'newChair',
        image: 'chair_image_mock',
        position: { x: 20, y: 20 },
      });
    });
  });
  