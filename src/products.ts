export type Product = {
  id: string;
  name: string;
  category: string;
  description: string;
  price: number | null;
  image: string;
  stock: number;
};

const image = (number: number) => `/images/products/photo_${number}_2026-09-04_00-41-40.jpg`;

export const initialProducts: Product[] = [
  ['3 Layers Plate Rack', 'Home Organization', 'Three-layer kitchen dish/plate rack.', 23500],
  ['2.2Lts Electric Kettle', 'Kitchen & Cookware', 'RAF R.7816 electric kettle; 2.0L.', 10000],
  ['Electric Pressure Cooker', 'Kitchen & Cookware', 'Electric pressure cooker; 6L capacity, 1000W.', 66500],
  ['Thermal Flask', 'Kitchen Tools & Accessories', 'Rechargeable fan shown with solar panel.', 1500],
  ['Cereal Dispenser', 'Food Storage', 'Cereal dispenser.', 2500],
  ['Cereal Dispenser', 'Kitchen Tools & Accessories', 'RAF electric blender, 4L, 8-in-1, 800W.', 2000],
  ['Bread Knife', 'Kitchen Tools & Accessories', 'RAF coffee bean grinder, 80W.', 1500],
  ['Double Pole Clothes Hanger', 'Home & Household', '12-inch rechargeable fan with solar panel.', 15000],
  ['Food Flask', 'Kitchen & Cookware', 'RAF R.7816 electric kettle; 2.0L.', 13500],
  ['Bottles', 'Home & Household', 'Foldable travel steam iron.', 4500],
  ['Baby Feeding Cup', 'Kitchen Tools & Accessories', 'RAF food processor; 8L, 1000W.', 2200],
  ['Food Flask', 'Kitchen & Cookware', 'RAF 25L electric oven, air fryer and toaster.', 14500],
  ['Stainless Steel Vacuum Flask', 'Kitchen Tools & Accessories', 'Cordless rechargeable food processor.', 4000],
  ['Water Bottle', 'Kitchen Tools & Accessories', 'RAF electric blender, 800W.', 4500],
  ['Insulated Food Flask', 'Kitchen Tools & Accessories', 'RAF coffee bean grinder, 400W.', 18500],
  ['High Vacuum Thermos Container', 'Kitchen Tools & Accessories', 'Citrus juicer, 45W, 700ml.', 14500],
  ['Food Flask', 'Home & Household', 'RAF vacuum cleaner, 900W.', 14500],
  ['Lunch Box', 'Kitchen Tools & Accessories', 'RAF food processor, 15L, 1000W.', 9500],
  ['Protable Electric Lunch Box', 'Home Organization', 'Three-layer kitchen dish/plate rack.', null],
  ['Silicone Air Fryer Liner', 'Water Bottles & Flasks', 'Reusable water bottles.', 3500],
  ['Food Flasks', 'Water Bottles & Flasks', "Children's water bottles.", 10000],
  ['Cookware Set', 'Water Bottles & Flasks', 'Insulated thermal flask set.', 145000],
  ['Electric Cooking Pot / Food Warmer', 'Kitchen & Cookware', 'Portable electric cooking and food-warming pot.', null],
  ['Coffee Machine', 'Water Bottles & Flasks', 'Vacuum thermos flasks.', 70000],
  ['Cookware Set', 'Water Bottles & Flasks', "Children's water bottle set.", 150000],
  ['Cutlery Set', 'Home Organization', 'Stackable storage containers.', 10000],
  ['Wooden Kitchen Utensils Set', 'Food Storage', 'Kitchen and food storage container set.', 16000],
  ['5 Layers', 'Kitchen Tools & Accessories', 'Silicone baking moulds.', 47000],
  ['AVinas 3.5L Electric Meat Grinder & Food Chopper', 'Gifts & Souvenirs', 'Food flask set with spoon.', 15500],
  ['Cup Set', 'Kitchen Tools & Accessories', '2.2L electric kettle; Synyx model shown in image.', 5000],
  ['Temperature Flask', 'Water Bottles & Flasks', 'Temperature-display insulated flask.', 3500],
  ['Menstrual Relief', 'Water Bottles & Flasks', 'Insulated vacuum flask.', 8000],
  ['2L Raf Stand Mixer with Stainless Bowl 250 Watts', 'Food Storage', 'Cereal dispenser.', 17000],
  ['GDTimes 9" Solar Rechargeable Fan', 'Food Storage', 'Cereal dispenser.', 23500],
  ['12 Inches GDTimes Solar Rechargeable Fan with 2 Bulbs', 'Kitchen Tools & Accessories', 'Kitchen knife and bread knife set.', 37000],
  ['GDtimes Solar Rechargeable Fan with 2 Bulbs and Solar Panel', 'Home Organization', 'Double-pole clothes drying rack.', 60000],
  ['5L Food Processor/Yam Pounder', 'Gifts & Souvenirs', 'Food flask/container.', 16500],
].map(([name, category, description, price], index) => ({
  id: String(index + 1), name: name as string, category: category as string, description: description as string,
  price: price as number | null, image: image(index + 1), stock: 12,
}));
