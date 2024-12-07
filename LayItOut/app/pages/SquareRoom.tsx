import React, { useEffect, useState, useRef } from 'react';
import { StyleSheet, Text, View, StatusBar, Image, TouchableOpacity, PanResponder, ScrollView } from 'react-native';
import * as ScreenOrientation from 'expo-screen-orientation';
import { captureRef } from 'react-native-view-shot';
import * as MediaLibrary from 'expo-media-library';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { getFirestore, collection, addDoc } from 'firebase/firestore';
import { FIREBASE_AUTH } from '../../FirebaseConfig';
import Ionicons from 'react-native-vector-icons/Ionicons';

// Direct imports for all furniture
import bathsink from '../../images/bathsink.png';
import bathsinkA from '../../images/bathroom sink 3A.png';
import bathsinkB from '../../images/bathroom sink 3B.png';
import bathsinkC from '../../images/bathroom sink 3C.png';
import bathtub from '../../images/bathtub3.png';
import bathtubA from '../../images/bathub 3A.png';
import bathtubB from '../../images/bathub 3B.png';
import bathtubC from '../../images/bathub 3C.png';
import bookshelf from '../../images/bookshelf_2.png';
import bookshelfA from '../../images/Abookshelf.png';
import bookshelfB from '../../images/Bbookshelf.png';
import bookshelfC from '../../images/Cbookshelf.png';
import chair from '../../images/Chair.png';
import chairA from '../../images/Achair.png';
import chairB from '../../images/Bchair.png';
import chairC from '../../images/Cchair.png';
import chair2 from '../../images/chair2.png';
import chair2A from '../../images/chair2A.png';
import chair2B from '../../images/chair2B.png';
import chair2C from '../../images/chair2C.png';
import closet from '../../images/closet.png';
import consoleTable from '../../images/consule.png';
import consoleTableA from '../../images/Aconsule.png';
import consoleTableB from '../../images/Bconsule.png';
import consoleTableC from '../../images/Cconsule.png';
import countertop from '../../images/countertop.png';
import countertopA from '../../images/countertopA.png';
import countertopB from '../../images/countertopB.png';
import countertopC from '../../images/countertopC.png';
import dining from '../../images/dining.png';
import diningA from '../../images/diningtableA.png';
import diningB from '../../images/diningtableB.png';
import diningC from '../../images/diningtableC.png';
import door from '../../images/door.png';
import doorTop from '../../images/doorTop.png';
import doorLeft from '../../images/doorLeft.png';
import doorRight from '../../images/doorRight.png';
import fireplace from '../../images/fireplace.png';
import fireplaceA from '../../images/Afireplace.png';
import fireplaceB from '../../images/Bfireplace.png';
import fireplaceC from '../../images/Cfireplace.png';
import fridge from '../../images/fridge.png';
import fridgeA from '../../images/fridgeA.png';
import fridgeB from '../../images/fridgeB.png';
import fridgeC from '../../images/fridgeC.png';
import kitchenTable from '../../images/kitchen table.png';
import kitchenTableA from '../../images/kitchentableA.png';
import kitchenTableB from '../../images/kitchentableB.png';
import kitchenTableC from '../../images/kitchentableC.png';
import lamp from '../../images/lamp.png';
import lampA from '../../images/Alamp.png';
import lampB from '../../images/Blamp.png';
import lampC from '../../images/Clamp.png';
import officeChair from '../../images/office chair.png';
import officeChairA from '../../images/office chairA.png';
import officeChairB from '../../images/office chairB.png';
import officeChairC from '../../images/office chairC.png';
import oven from '../../images/oven.png';
import ovenA from '../../images/ovenA.png';
import ovenB from '../../images/ovenB.png';
import ovenC from '../../images/ovenC.png';
import p from '../../images/p.png';
import pA from '../../images/Ap.png';
import pB from '../../images/Bp.png';
import pC from '../../images/Cp.png';
import queenbed from '../../images/queenbed.png';
import queenbedA from '../../images/queenbed-1A.png';
import queenbedB from '../../images/queenbed-1B.png';
import queenbedC from '../../images/queenbed-1C.png';
import side1 from '../../images/side1.png';
import side1A from '../../images/side tableA.png';
import side1B from '../../images/side tableB.png';
import side1C from '../../images/side tableC.png';
import side2 from '../../images/side2.png';
import side2A from '../../images/sidebed tableA.png';
import side2B from '../../images/sidebed tableB.png';
import side2C from '../../images/sidebed tableC.png';
import sidebed from '../../images/sidebed.png';
import sidebedA from '../../images/sidebed table-1A.png';
import sidebedB from '../../images/sidebed table-1B.png';
import sidebedC from '../../images/sidebed table-1C.png';
import singlebed from '../../images/singlebed.png';
import singlebedA from '../../images/single bed-1A.png';
import singlebedB from '../../images/single bed-1B.png';
import singlebedC from '../../images/single bed-1C.png';
import sofa2 from '../../images/sofa2.png';
import sofa2A from '../../images/Asofa2.png';
import sofa2B from '../../images/Bsofa2.png';
import sofa2C from '../../images/Csofa2.png';
import sofa3 from '../../images/sofa3.png';
import sofa3A from '../../images/Asofa3.png';
import sofa3B from '../../images/Bsofa3.png';
import sofa3C from '../../images/Csofa3.png';
import sink from '../../images/sink.png';
import sinkA from '../../images/sinkA.png';
import sinkB from '../../images/sinkB.png';
import sinkC from '../../images/sinkC.png';
import stove from '../../images/stove.png';
import stoveA from '../../images/stoveA.png';
import stoveB from '../../images/stoveB.png';
import stoveC from '../../images/stoveC.png';
import table from '../../images/table.png';
import tableA from '../../images/tableA.png';
import tableB from '../../images/tableB.png';
import tableC from '../../images/tableC.png';
import table1 from '../../images/table1.png';
import table1A from '../../images/Acoffee table.png';
import table1B from '../../images/Bcoffee table.png';
import table1C from '../../images/Ccoffee table.png';
import table2 from '../../images/table2.png';
import table3 from '../../images/table3.png';
import toilet from '../../images/toilet.png';
import toiletA from '../../images/toiletA.png';
import toiletB from '../../images/toiletB.png';
import toiletC from '../../images/toiletC.png';
import trashcan from '../../images/trashcan.png';
import trashcanA from '../../images/trash canA.png';
import trashcanB from '../../images/trash canB.png';
import trashcanC from '../../images/trash canC.png';
import tv from '../../images/tv.png';
import tvA from '../../images/AGrid_24-5 3.png';
import tvB from '../../images/BGrid_24-5 3.png';
import tvC from '../../images/CGrid_24-5 3.png';
import wardrobe from '../../images/wardrobe.png';
import wardrobeA from '../../images/wardrobeA.png';
import wardrobeB from '../../images/wardrobeB.png';
import wardrobeC from '../../images/wardrobeC.png';
import washingMachine from '../../images/washing machine.png';
import washingMachineA from '../../images/washing machineA.png';
import washingMachineB from '../../images/washing machineB.png';
import washingMachineC from '../../images/washing machineC.png';
import window from '../../images/window.png';
import vertWindow from '../../images/vertWindow.png';

const scaleFactor = 27.27

// Furniture categories organization
const furnitureCategories = {
  'General': [
    { name: 'Doors ', 
      subcategories: [
        { name: 'Door (Right)', image: door, dimensions:{width: 3, height: 3} },
        { name: 'Door (Top)', image: doorTop, dimensions:{width: 3, height: 3} },
        { name: 'Door (Left)', image: doorRight, dimensions:{width: 3, height: 3} },
        { name: 'Door (Bottom)', image: doorLeft, dimensions:{width: 3, height: 3} },
      ]
    },
    { name: 'Windows ', 
      subcategories: [
        { name: 'Window (H)', image: window, dimensions:{width: 3, height: .5} },
        { name: 'Window (V)', image: vertWindow, dimensions:{width: .8, height: 3} },
      ]
    },
    { name: 'In Wall Closets ', 
      subcategories: [
        { name: 'Closet (H)', image: window, dimensions:{width: 5, height: .5} },
        { name: 'Closet (V)', image: vertWindow, dimensions:{width: .8, height: 3} },
      ]
    },
  ],
  'Living Room': [
    { name: 'Sofas ', 
      subcategories: [
        { name: 'Sofa (2-Seater)', image: sofa2, dimensions:{width: 4.5, height: 2.5} }, 
        { name: 'Sofa (2-Seater)', image: sofa2A, dimensions:{width: 2.5, height: 4.5} },
        { name: 'Sofa (2-Seater)', image: sofa2B, dimensions:{width: 4.5, height: 2.5} },
        { name: 'Sofa (2-Seater)', image: sofa2C, dimensions:{width: 2.5, height: 4.5} },
        { name: 'Sofa (3-Seater)', image: sofa3, dimensions:{width: 5.8, height: 2.5} },
        { name: 'Sofa (3-Seater)', image: sofa3A, dimensions:{width: 2.5, height: 5.8} },
        { name: 'Sofa (3-Seater)', image: sofa3B, dimensions:{width: 5.8, height: 2.5} },
        { name: 'Sofa (3-Seater)', image: sofa3C, dimensions:{width: 2.5, height: 5.8} },
      ]
    },
    { name: 'Chairs ', 
      subcategories: [
        { name: 'Chair', image: chair, dimensions:{width: 2.5, height: 2.5} },
        { name: 'Chair', image: chairA, dimensions:{width: 2.5, height: 2.5} },
        { name: 'Chair', image: chairB, dimensions:{width: 2.5, height: 2.5} },
        { name: 'Chair', image: chair2C, dimensions:{width: 2.5, height: 2.5} }, 
      ]
    },
    { name: 'Tables ', 
      subcategories: [
        { name: 'Side Table 1', image: side1, dimensions:{width: 1.5, height: 2} },
        { name: 'Side Table 1', image: side1A, dimensions:{width: 2, height: 1.5} }, 
        { name: 'Side Table 1', image: side1B, dimensions:{width: 1.5, height: 2} }, 
        { name: 'Side Table 1', image: side1C, dimensions:{width: 2, height: 1.5} }, 
        { name: 'Side Table 2', image: side2, dimensions:{width: 1.5, height: 2} },
        { name: 'Side Table 2', image: side2A, dimensions:{width: 2, height: 1.5} }, 
        { name: 'Side Table 2', image: side2B, dimensions:{width: 1.5, height: 2} }, 
        { name: 'Side Table 2', image: side2C, dimensions:{width: 2, height: 1.5} }, 
        { name: 'Console Table', image: consoleTable, dimensions:{width: 3, height: 3} },
        { name: 'Console Table', image: consoleTableA, dimensions:{width: 3, height: 3} }, 
        { name: 'Console Table', image: consoleTableB, dimensions:{width: 3, height: 3} }, 
        { name: 'Console Table', image: consoleTableC, dimensions:{width: 3, height: 3} }, 
        { name: 'Coffee Table', image: table1, dimensions:{width: 3, height: 1.5} },
        { name: 'Coffee Table', image: table1A, dimensions:{width: 1.5, height: 3} }, 
        { name: 'Coffee Table', image: table1B, dimensions:{width: 3, height: 1.5} }, 
        { name: 'Coffee Table', image: table1C, dimensions:{width: 1.5, height: 3} }, 
      ]
    },
    { name: 'Bookshelves ', 
      subcategories: [
        { name: 'Bookshelf', image: bookshelf, dimensions:{width: 3, height: 5.5} },
        { name: 'Bookshelf', image: bookshelfA, dimensions:{width: 5.5, height: 3} },
        { name: 'Bookshelf', image: bookshelfB, dimensions:{width: 3, height: 5.5} },
        { name: 'Bookshelf', image: bookshelfC, dimensions:{width: 5.5, height: 3} },
      ]
    },
    { name: 'Fireplaces ', 
      subcategories: [
        { name: 'Fireplace', image: fireplace, dimensions:{width: 3, height: 2.5} },
        { name: 'Fireplace', image: fireplaceA, dimensions:{width: 2.5, height: 3} }, 
        { name: 'Fireplace', image: fireplaceB, dimensions:{width: 3, height: 2.5} }, 
        { name: 'Fireplace', image: fireplaceC, dimensions:{width: 2.5, height: 3} }, 
      ] 
    },
    { name: 'Lamps ', 
      subcategories: [
        { name: 'Lamp', image: lamp, dimensions:{width: 2, height: 5} },
        { name: 'Lamp', image: lampA, dimensions:{width: 5, height: 2} },
        { name: 'Lamp', image: lampB, dimensions:{width: 2, height: 5} },
        { name: 'Lamp', image: lampC, dimensions:{width: 5, height: 2} },
      ]
    },
    { name: 'TVs ', 
      subcategories: [
        { name: 'TV', image: tv, dimensions:{width: 5.2, height: 5} },
        { name: 'TV', image: tvA, dimensions:{width: 5, height: 5.2} },
        { name: 'TV', image: tvB, dimensions:{width: 5.2, height: 5} },
        { name: 'TV', image: tvC, dimensions:{width: 5, height: 5.2} },
      ]
    },
  ],
  'Bedroom': [
    { name: 'Beds ', 
      subcategories: [
        { name: 'King Bed', image: queenbed, dimensions:{width: 6.3, height: 6.67} },
        { name: 'King Bed', image: queenbedA, dimensions:{width: 6.67, height: 6.3} },
        { name: 'King Bed', image: queenbedB, dimensions:{width: 6.3, height: 6.67} },
        { name: 'King Bed', image: queenbedC, dimensions:{width: 6.67, height: 6.3} },
        { name: 'Queen Bed', image: queenbed, dimensions:{width: 5, height: 6.67} },
        { name: 'Queen Bed', image: queenbedA, dimensions:{width: 6.67, height: 5} },
        { name: 'Queen Bed', image: queenbedB, dimensions:{width: 5, height: 6.67} },
        { name: 'Queen Bed', image: queenbedC, dimensions:{width: 6.67, height: 5} },
        { name: 'Full Bed', image: queenbed, dimensions:{width: 4.5, height: 6.25} },
        { name: 'Full Bed', image: queenbedA, dimensions:{width: 6.25, height: 4.5} },
        { name: 'Full Bed', image: queenbedB, dimensions:{width: 4.5, height: 6.25} },
        { name: 'Full Bed', image: queenbedC, dimensions:{width: 6.25, height: 4.5} },
        { name: 'Twin XL Bed', image: singlebed, dimensions:{width: 3.2, height: 6.67} },
        { name: 'Twin XL Bed', image: singlebedA, dimensions:{width: 6.67, height: 3.2} },
        { name: 'Twin XL Bed', image: singlebedB, dimensions:{width: 3.2, height: 6.67} },
        { name: 'Twin XL Bed', image: singlebedC, dimensions:{width: 6.67, height: 3.2} },
        { name: 'Twin Bed', image: singlebed, dimensions:{width: 3.2, height: 6.25} },
        { name: 'Twin Bed', image: singlebedA, dimensions:{width: 6.25, height: 3.2} },
        { name: 'Twin Bed', image: singlebedB, dimensions:{width: 3.2, height: 6.25} },
        { name: 'Twin Bed', image: singlebedC, dimensions:{width: 6.25, height: 3.2} },
      ]
    },
    { name: 'Bedside Tables ', 
      subcategories: [
        { name: 'Bedside Table', image: sidebed, dimensions:{width: 2, height: 2} },
        { name: 'Bedside Table', image: sidebedA, dimensions:{width: 2, height: 2} },
        { name: 'Bedside Table', image: sidebedB, dimensions:{width: 2, height: 2} },
        { name: 'Bedside Table', image: sidebedC, dimensions:{width: 2, height: 2} },
      ]
    },
    { name: 'Wardrobes ', 
      subcategories: [
        { name: 'Wardrobe', image: wardrobe, dimensions:{width: 3.5, height: 6} },
        { name: 'Wardrobe', image: wardrobeA, dimensions:{width: 6, height: 3.5} },
        { name: 'Wardrobe', image: wardrobeB, dimensions:{width: 3.5, height: 6} },
        { name: 'Wardrobe', image: wardrobeC, dimensions:{width: 6, height: 3.5} },
      ]
    },
    { name: 'Office Chairs ', 
      subcategories: [
        { name: 'Office Chair', image: officeChair, dimensions:{width: 1.7, height: 2} },
        { name: 'Office Chair', image: officeChairA, dimensions:{width: 2, height: 1.7} },
        { name: 'Office Chair', image: officeChairB, dimensions:{width: 1.7, height: 2} },
        { name: 'Office Chair', image: officeChairC, dimensions:{width: 2, height: 1.7} },
      ]
    },
    { name: 'Desks ', 
      subcategories: [
        { name: 'Desk', image: table, dimensions:{width: 5, height: 2.7} },
        { name: 'Desk', image: tableA, dimensions:{width: 2.7, height: 5} },
        { name: 'Desk', image: tableB, dimensions:{width: 5, height: 2.7} },
        { name: 'Desk', image: tableC, dimensions:{width: 2.7, height: 5} },
      ]
    },
    { name: 'Plants ', 
      subcategories: [
        { name: 'Plant', image: p, dimensions:{width: 1, height: 1} },
        { name: 'Plant', image: pA, dimensions:{width: 1, height: 1} },
        { name: 'Plant', image: pB, dimensions:{width: 1, height: 1} },
        { name: 'Plant', image: pC, dimensions:{width: 1, height: 1} },
      ]
    },
  ],
  'Kitchen': [
    { name: 'Refrigerators ', 
      subcategories: [
        { name: 'Refrigerator', image: fridge, dimensions:{width: 2.5, height: 5.5} },
        { name: 'Refrigerator', image: fridgeA, dimensions:{width: 5.5, height: 2.5} },
        { name: 'Refrigerator', image: fridgeB, dimensions:{width: 2.5, height: 5.5} },
        { name: 'Refrigerator', image: fridgeC, dimensions:{width: 5.5, height: 2.5} },
      ]
    },
    { name: 'Sinks ', 
      subcategories: [
        { name: 'Sink', image: sink, dimensions:{width: 2, height: 2.5} }, 
        { name: 'Sink', image: sinkA, dimensions:{width: 2.5, height: 2} }, 
        { name: 'Sink', image: sinkB, dimensions:{width: 2, height: 2.5} }, 
        { name: 'Sink', image: sinkC, dimensions:{width: 2.5, height: 2} }, 
      ]
    },
    { name: 'Kitchen Tables ', 
      subcategories: [
        { name: 'Kitchen Table', image: kitchenTable, dimensions:{width: 4.5, height: 2} },
        { name: 'Kitchen Table', image: kitchenTableA, dimensions:{width: 2, height: 4.5} },
        { name: 'Kitchen Table', image: kitchenTableB, dimensions:{width: 4.5, height: 2} },
        { name: 'Kitchen Table', image: kitchenTableC, dimensions:{width: 2, height: 4.5} },
      ]
    },
    { name: 'Countertops ', 
      subcategories: [
        { name: 'Countertop', image: countertop, dimensions:{width: 4, height: 3} },
        { name: 'Countertop', image: countertopA, dimensions:{width: 3, height: 4} },
        { name: 'Countertop', image: countertopB, dimensions:{width: 4, height: 3} },
        { name: 'Countertop', image: countertopC, dimensions:{width: 3, height: 4} },
      ]
    },
    { name: 'Ovens ', 
      subcategories: [
        { name: 'Oven', image: oven, dimensions:{width: 2.5, height: 3} },
        { name: 'Oven', image: ovenA, dimensions:{width: 3, height: 2.5} },
        { name: 'Oven', image: ovenB, dimensions:{width: 2.5, height: 3} },
        { name: 'Oven', image: ovenC, dimensions:{width: 3, height: 2.5} },
      ]
    },
    { name: 'Stoves ', 
      subcategories: [
        { name: 'Stove', image: stove, dimensions:{width: 2.5, height: 3} }, 
        { name: 'Stove', image: stoveA, dimensions:{width: 3, height: 2.5} }, 
        { name: 'Stove', image: stoveB, dimensions:{width: 2.5, height: 3} }, 
        { name: 'Stove', image: stoveC, dimensions:{width: 3, height: 2.5} }, 
      ]
    },
    { name: 'Dining Sets ', 
      subcategories: [
        { name: 'Dining Set', image: dining, dimensions:{width: 4.5, height: 2.5 } },
        { name: 'Dining Set', image: diningA, dimensions:{width: 2.5, height: 4.5 } },
        { name: 'Dining Set', image: diningB, dimensions:{width: 4.5, height: 2.5 } },
        { name: 'Dining Set', image: diningC, dimensions:{width: 2.5, height: 4.5 } },
      ]
    },
    { name: 'Dining Chairs ', 
      subcategories: [
        { name: 'Dining Chair', image: chair2, dimensions:{width: 2, height: 2.3} },
        { name: 'Dining Chair', image: chair2A, dimensions:{width: 2.3, height: 2} },
        { name: 'Dining Chair', image: chair2B, dimensions:{width: 2, height: 2.3} },
        { name: 'Dining Chair', image: chairC, dimensions:{width: 2.3, height: 2} }, 
      ]
    },
    { name: 'Trash Cans ', 
      subcategories: [
        { name: 'Trash Can', image: trashcan, dimensions:{width: 2, height: 3 } }, 
        { name: 'Trash Can', image: trashcanA, dimensions:{width: 3, height: 2 } },
        { name: 'Trash Can', image: trashcanB, dimensions:{width: 2, height: 3 } },
        { name: 'Trash Can', image: trashcanC, dimensions:{width: 3, height: 2 } },
      ]
    },
  ],
  'Bathroom': [
    { name: 'Bathtubs ', 
      subcategories: [
        { name: 'Bathtub', image: bathtub, dimensions:{width: 5, height: 4} },
        { name: 'Bathtub', image: bathtubA, dimensions:{width: 4, height: 5} },
        { name: 'Bathtub', image: bathtubB, dimensions:{width: 5, height: 4} },
        { name: 'Bathtub', image: bathtubC, dimensions:{width: 4, height: 5} },
      ]
    },
    { name: 'Sinks ', 
      subcategories: [
        { name: 'Sink', image: bathsink, dimensions:{width: 2, height: 2.5} },
        { name: 'Sink', image: bathsinkA, dimensions:{width: 2.5, height: 2} },
        { name: 'Sink', image: bathsinkB, dimensions:{width: 2, height: 2.5} },
        { name: 'Sink', image: bathsinkC, dimensions:{width: 2.5, height: 2} },
      ]
    },
    { name: 'Toilets ', 
      subcategories: [
        { name: 'Toilet', image: toilet, dimensions:{width: 2.5, height: 2.5} },
        { name: 'Toilet', image: toiletA, dimensions:{width: 2.5, height: 2.5} }, 
        { name: 'Toilet', image: toiletB, dimensions:{width: 2.5, height: 2.5} }, 
        { name: 'Toilet', image: toiletC, dimensions:{width: 2.5, height: 2.5} }, 
      ]
    },
    { name: 'Washing Machines ', 
      subcategories: [
        { name: 'Washing Machine', image: washingMachine, dimensions:{width: 2.5, height: 3} },
        { name: 'Washing Machine', image: washingMachineA, dimensions:{width: 3, height: 2.5} },
        { name: 'Washing Machine', image: washingMachineB, dimensions:{width: 2.5, height: 3} },
        { name: 'Washing Machine', image: washingMachineC, dimensions:{width: 3, height: 2.5} }
      ]
    },
  ]
};

// Draggable furniture component
const DraggableFurniture = ({ 
  image, 
  initialPosition,
  onTargetLinePositionChange, 
  onPositionChange, 
  onTargetLineHeightChange, 
  onDraggingChange, 
  onBottomLinePositionChange,
  onBottomFurnitureChange,
  onLeftLinePositionChange, 
  onLeftLineHeightChange,
  onRightLinePositionChange,
  onRightFurnitureChange, 
  dimensions, 
  onDelete, 
  id, 
  deleteMode
 }) => {
  const positionRef = useRef(initialPosition);
  const [position, setPosition] = useState(initialPosition);

  const roomWidth = 300; // Adjust if your room dimensions change
  const roomHeight = 300; // Adjust if your room dimensions change
  const scaledWidth = dimensions.width * scaleFactor
  const scaledHeight = dimensions.height * scaleFactor

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        onDraggingChange(true); // Notify parent that dragging has started
      },
      onPanResponderMove: (evt, gestureState) => {
        const newX = positionRef.current.x + gestureState.dx * 0.5;
        const newY = positionRef.current.y + gestureState.dy * 0.5;

        const clampedX = Math.max(0, Math.min(roomWidth/2-5 - scaledWidth/2, newX));
        const clampedY = Math.max(0, Math.min(roomHeight/2-5 - scaledHeight/2, newY));

        setPosition({ x: clampedX, y: clampedY });

        onTargetLineHeightChange(clampedY*2);
        onTargetLinePositionChange(clampedX*2 + scaledWidth/2); // Update line position

        onLeftLineHeightChange(clampedY*2 + scaledHeight/2);
        onLeftLinePositionChange(clampedX*2);

        const clampedBottomLineY = Math.min(clampedY*2 + scaledHeight + 5, 300);
        onBottomLinePositionChange(clampedX*2 + scaledWidth/2, clampedBottomLineY);
        onBottomFurnitureChange(clampedY*2 + scaledHeight);

        const clampedRightLineX = Math.max(0, 300 - 5 - (clampedX*2 + scaledWidth));
        onRightLinePositionChange(clampedRightLineX, (clampedY*2 + scaledHeight/2));
        onRightFurnitureChange((clampedX*2 + scaledWidth));
      },
      onPanResponderRelease: (evt, gestureState) => {
        const newX = positionRef.current.x + gestureState.dx * 0.5;
        const newY = positionRef.current.y + gestureState.dy * 0.5;

        // Clamp the final positions to ensure the furniture stays within bounds
        const clampedX = Math.max(0, Math.min(roomWidth/2-5 - scaledWidth/2, newX));
        const clampedY = Math.max(0, Math.min(roomHeight/2-5 - scaledHeight/2, newY));

        positionRef.current = { x: clampedX, y: clampedY };
        setPosition({ x: clampedX, y: clampedY });
        onPositionChange({ x: clampedX, y: clampedY });


        // Hide the target line and text once the furniture is released
        onTargetLinePositionChange(null);
        onBottomLinePositionChange(null, null);
        onDraggingChange(false);
      },
    })
  ).current;

  return (
    <View style={[
      styles.furnitureInRoom, { 
        position: "absolute",
        left: position.x, 
        top: position.y,
        width: dimensions.width,
        height: dimensions.height,
      }]}
      {...panResponder.panHandlers}
      >
    
      <Image
        source={image}
        style={[styles.furnitureInRoom, { left: position.x, top: position.y, width: scaledWidth, height: scaledHeight }]}
        resizeMode='stretch'
        {...panResponder.panHandlers}
      />
      {deleteMode && (
        <TouchableOpacity 
          style={[styles.deleteButton, { left: position.x + scaledWidth - 15, top: position.y - 15 }]} 
          onPress={() => onDelete(id)}
        >
          <Ionicons name="close-circle-outline" size={25} color="red" style={{ fontWeight: 'bold'}}/>
        </TouchableOpacity>
      )}
    </View>
  );
};

// Furniture sidebar component
const FurnitureSidebar = ({ addFurniture }) => {
  const [expandedCategory, setExpandedCategory] = useState(null);
  const [expandedSubcategory, setExpandedSubcategory] = useState(null);

  const toggleCategory = (category) => {
    setExpandedCategory(expandedCategory === category ? null : category);
  };

  const toggleSubcategory = (subcategory) => {
    setExpandedSubcategory(expandedSubcategory === subcategory ? null : subcategory);
  };

  return (
    <View style={styles.sidebar}>
      <Text style={styles.title}>Furniture List</Text>
      <View style={styles.scrollViewContainer}>
        <ScrollView 
          style={[styles.scrollView, { transform: [{ scaleX: -1 }] }]}
          showsVerticalScrollIndicator={true}
          bounces={false}
          contentContainerStyle={styles.scrollViewContent}
          scrollIndicatorInsets={{ right: 1 }}
        >
          <View style={[styles.scrollViewInner, { transform: [{ scaleX: -1 }] }]}>

            {Object.entries(furnitureCategories).map(([category, items]) => (
              <View key={category} style={styles.categoryContainer}>
                {/* Main Category */}
                <TouchableOpacity 
                  style={styles.categoryHeader}
                  onPress={() => toggleCategory(category)}
                >
                  <Text style={styles.categoryTitle}>{category}</Text>
                  <Text style={styles.expandIcon}>
                    {expandedCategory === category ? '−' : '+'}
                  </Text>
                </TouchableOpacity>

                {/* Items/Subcategories */}
                {expandedCategory === category && items.map((item, index) => (
                  <View key={`${category}-${index}`}>
                    <TouchableOpacity 
                      style={styles.furnitureItem} 
                      onPress={() => {
                        item.subcategories
                          ? toggleSubcategory(item.name)
                          : addFurniture(item.name, item.image, item.dimensions);
                      }}
                    >
                      <Text style={styles.furnitureText}>{item.name}</Text>
                      {item.subcategories && (
                        <Text style={styles.expandIcon}>
                          {expandedSubcategory === item.name ? '−' : '+'}
                        </Text>
                      )}
                    </TouchableOpacity>

                    {/* Subcategories */}
                    {expandedSubcategory === item.name &&
                      item.subcategories?.map((subItem, subIndex) => (
                        <TouchableOpacity
                          key={`${category}-${index}-${subIndex}`}
                          style={[styles.furnitureItem, {marginLeft: 0}]}
                          onPress={() => addFurniture(subItem.name, subItem.image, subItem.dimensions)}
                        >
                          <Image source={subItem.image} style={styles.furnitureImage} resizeMode="contain" />
                        </TouchableOpacity>
                      ))}
                  </View>
                ))}
              </View>
            ))}

          </View>
        </ScrollView>
      </View>
    </View>
  );
};

// Main component
const SquareRoom = () => {
  const [furnitureItems, setFurnitureItems] = useState([]);
  const [targetLinePosition, setTargetLinePosition] = useState(null);
  const [targetLineHeight, setTargetLineHeight] = useState(null);
  const [bottomLinePosition, setBottomLinePosition] = useState(null);
  const [bottomLineHeight, setBottomLineHeight] = useState(null);
  const [bottomFurniture, setBottomFurniture] = useState(null);
  const [leftLinePosition, setLeftLinePosition] = useState(null);
  const [leftLineHeight, setLeftLineHeight] = useState(null);
  const [rightLinePosition, setRightLinePosition] = useState(null);
  const [rightLineHeight, setRightLineHeight] = useState(null);
  const [rightFurniture, setRightFurniture] = useState(null);
  const [isDragging, setIsDragging] = useState(false); // Track dragging state
  const viewShotRef = useRef(null);
  const uid = FIREBASE_AUTH.currentUser ? FIREBASE_AUTH.currentUser.uid : null;
  const [isRed, setIsRed] = useState(false); // State to track the button color

  const toggleDeleteMode = () => {
    setIsRed((prevState) => !prevState); // Toggle the color state
  };

  const handleDelete = (id) => {
    setFurnitureItems((prevItems) => prevItems.filter(item => item.id !== id));
  };

  const calculateDistanceText = (height) => {
    const feet = Math.floor(height / 50); // Convert height to feet (whole number part)
    const inches = ((height / 50) % 1) * 12; // Convert the fractional part to inches
    return `${feet} ft ${inches.toFixed(1)} in`;
  };
  
  const calculateBottomLineLength = (startX, endX) => {
    const length = Math.abs(endX - startX); // Horizontal length in pixels
    const feet = Math.floor(length / 50); // Convert length to feet (whole number part)
    const inches = ((length / 50) % 1) * 12; // Convert the fractional part to inches
    return `${feet} ft ${inches.toFixed(1)} in`;
  };

  useEffect(() => {
    const setOrientation = async () => {
      await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE_LEFT);
    };
    setOrientation();

    return () => {
      const unlockOrientation = async () => {
        await ScreenOrientation.unlockAsync();
      };
      unlockOrientation();
    };
  }, []);

  const addFurniture = (name, image, dimensions) => {
    const newItem = { id: `${name}-${Date.now()}`, name, image, dimensions, position: { x: 20, y: 20 } };
    setFurnitureItems((prevItems) => {
      const updatedItems = [...prevItems, newItem];
      //console.log('Furniture array after addition:', updatedItems);
      return updatedItems;
    });
  };

  const takeScreenshot = async () => {
    if (viewShotRef.current) {
      try {
        const uri = await captureRef(viewShotRef.current, {
          format: 'png',
          quality: 0.8,
        });

        const { status } = await MediaLibrary.requestPermissionsAsync();
        if (status === 'granted') {
          const asset = await MediaLibrary.createAssetAsync(uri);
          
          const storage = getStorage();
          const storageRef = ref(storage, `users/${uid}/${Date.now()}.png`);

          const response = await fetch(uri);
          const blob = await response.blob();

          await uploadBytes(storageRef, blob);
          const downloadURL = await getDownloadURL(storageRef);

          const firestore = getFirestore();
          await addDoc(collection(firestore, 'screenshots'), {
            downloadURL: downloadURL,
            uid: uid,
            createdAt: new Date(),
          });

          alert('Screenshot saved successfully to Firebase and gallery!');
        } else {
          alert('Permission to access media library is required!');
        }
      } catch (error) {
        console.error("Error taking screenshot:", error);
        alert('Failed to save screenshot.');
      }
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="black" />
      <FurnitureSidebar addFurniture={addFurniture} />
      <View style={styles.mainContent}>
      <View ref={viewShotRef} style={styles.room}>
        {/* Conditionally render the target line at a dynamic position */}
        {targetLinePosition !== null && (
          <View
            style={[
              styles.targetLine,
              { left: targetLinePosition },
              { height: targetLineHeight },
            ]}
          />
        )}
        {bottomLinePosition !== null && (
          <View
            style={[
              styles.targetLine,
              { left: bottomLinePosition, top: bottomLineHeight },
            ]}
          />
        )}
        {isDragging && leftLinePosition !== null && leftLinePosition > 0 && (
          <View
            style={[
              styles.horizontalLine,
              { width: leftLinePosition },
              { top: leftLineHeight },
            ]}
          />
        )}
        {isDragging && rightLinePosition !== null && (
          <View
            style={[
              styles.horizontalLine,
              { left: rightLinePosition },
              { top: rightLineHeight },
            ]}
          />
        )}
        {isDragging && (
          <Text style={[styles.distanceText, { left: targetLinePosition + 5, top: targetLineHeight / 2 }]}>
            {calculateDistanceText(targetLineHeight)}
          </Text>
        )}
        {isDragging && (
          <Text style={[styles.distanceText, { left: bottomLinePosition - 75, top: (bottomLineHeight + 230) / 2 }]}>
            {calculateBottomLineLength(bottomFurniture, 300 - 10)}
          </Text>
        )}
        {isDragging && (
          <Text style={[styles.distanceText, { left: (leftLinePosition - 100) / 2, top: leftLineHeight - 25 }]}>
            {calculateDistanceText(leftLinePosition)}
          </Text>
        )}
        {isDragging && (
          <Text style={[styles.distanceText, { left: (rightLinePosition + 270) / 2, top: rightLineHeight + 5}]}>
            {calculateBottomLineLength(rightFurniture, 300 - 10)}
          </Text>
        )}
        {furnitureItems.map((item) => (
          <DraggableFurniture
            key={item.id}
            id={item.id}
            image={item.image}
            dimensions={item.dimensions}
            initialPosition={item.position}
            onTargetLinePositionChange={(position) => setTargetLinePosition(position)}
            onPositionChange={(newPosition) => {
              setFurnitureItems((prevItems) => {
                const updatedItems = prevItems.map((furniture) =>
                  furniture.id === item.id ? { ...furniture, position: newPosition } : furniture
                );
                return updatedItems;
              });
            }}
            onDelete={handleDelete}
            deleteMode={isRed}
            onTargetLineHeightChange={(positionY) => setTargetLineHeight(positionY)}

            onBottomLinePositionChange={(x, y) => {
              setBottomLinePosition(x);
              setBottomLineHeight(y);
            }}
            onBottomFurnitureChange={(bottomY) => setBottomFurniture(bottomY)}

            onLeftLinePositionChange={(position) => setLeftLinePosition(position)}
            onLeftLineHeightChange={(positionY) => setLeftLineHeight(positionY)}

            onRightLinePositionChange={(rightEdgeX, positionY) => {
              const distanceFromRight = 300 - rightEdgeX; // Calculate distance from right wall
              setRightLinePosition(distanceFromRight); // Set the correct position
              setRightLineHeight(positionY + 5); // Update line's vertical alignment
            }}
            onRightFurnitureChange={(rightEdgePosition) => setRightFurniture(rightEdgePosition)}

            onDraggingChange={setIsDragging} // Track dragging state
          />
        ))}
      </View>
      <TouchableOpacity style={styles.screenshotButton} onPress={takeScreenshot}>
        <Image 
          source={require('../../images/Camera.png')} // Update with your image path
          style={styles.buttonImage}
        />
      </TouchableOpacity>
      <TouchableOpacity
        style={[
          styles.globalDeleteButton,
          { backgroundColor: isRed ? 'grey' : 'red' }, // Dynamically set background color
        ]}
        onPress={toggleDeleteMode}
      >
        <Ionicons name="trash-outline" size={35} color="white" />
      </TouchableOpacity>
    </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: 'white',
  },
  sidebar: {
    width: 200,
    backgroundColor: '#abc2da',
    height: '100%',
    paddingTop: 12,
    paddingRight: 12,
    paddingLeft: 1,
  },
  scrollViewContainer: {
    flex: 1,
    marginRight: -2,
  },
  scrollView: {
    flex: 1,
    marginBottom: 12,
  },
  scrollViewContent: {
    paddingRight: 1,
  },
  scrollViewInner: {
    paddingLeft: 9,
  },
  mainContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  room: {
    // using scale factor of 27.27 so this is a 11 x 11 room
    width: 300,
    height: 300,
    aspectRatio: 1,
    borderWidth: 3,
    borderColor: 'white',
    backgroundColor: '#045497',
    position: 'relative',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#045497',
    textAlign: 'center',
    paddingLeft: 9,
  },
  categoryContainer: {
    marginBottom: 5,
    width: '100%',
  },
  categoryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 16,
    backgroundColor: '#045497',
    borderRadius: 12,
    marginBottom: 12,
  },
  categoryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
  expandIcon: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  furnitureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  furnitureImage: {
    width: 50,
    height: 50,
    marginRight: 10,
  },
  furnitureText: {
    color: "#1c4f88",
    fontSize: 16,
  },
  furnitureInRoom: {
    width: 50,
    height: 50,
    position: 'absolute',
  },
  screenshotButton: {
    position: 'absolute',
    bottom: 25,
    right: 20,
  },
  buttonImage: {
    width: 35, // Set the desired width
    height: 35, // Set the desired height
  },
  distanceText: {
    position: 'absolute',
    fontSize: 12,
    color: 'black',
    fontWeight: 'bold',
    backgroundColor: 'white',
    padding: 2,
    borderRadius: 3,
  },
  targetLine: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: 2,
    backgroundColor: 'red',
  },
  targetText: {
    position: 'absolute',
    left: 10,
    fontSize: 14,
    color: 'black',
  },
  horizontalLine: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: 'red',
  },
  deleteButton: { 
    position: 'absolute', 
    top: -10, 
    right: -10,  
    width: 25,  // Set width of the circle slightly bigger than the icon
    height: 25,  // Set height of the circle slightly bigger than the icon
    backgroundColor: 'white',
    borderRadius: 10,  // Half of the width/height to make it circular
    justifyContent: 'center',  // Center the icon horizontally
    alignItems: 'center',  // Center the icon vertically
    fontWeight: 'bold'
  },
  deleteButtonText: { 
    color: 'white', 
    fontSize: 16 
  },
  globalDeleteButton: { 
    position: 'absolute', 
    right: 10, 
    top: 200, 
    width: 50,  // Set a fixed width for the background box
    height: 50, // Set a fixed height for the background box
    //backgroundColor: 'red',
    justifyContent: 'center', // Center contents vertically
    alignItems: 'center', // Center contents horizontally
    borderRadius: 20, // Optional: make the background box rounded
    flexDirection: 'row', // Ensure the icon and text are in a row
  },  
  globalDeleteButtonText: { 
    color: 'white',
    textAlign: 'center',  // Center the text
    marginLeft: 5,  // Optional: add space between icon and text
  },
});

export default SquareRoom;