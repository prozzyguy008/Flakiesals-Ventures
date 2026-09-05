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
  ['RAF Hand Mixer', 'Kitchen & Cookware', 'Hand mixer with stainless-steel bowl; model R.6637.', 17000],
  ['RAF Electric Pressure Cooker 6L 1000W', 'Kitchen & Cookware', 'Electric pressure cooker; 6L capacity, 1000W.', 66500],
  ['GDTIMES Rechargeable Table Fan with Solar Panel', 'Kitchen Tools & Accessories', 'Rechargeable fan shown with solar panel.', null],
  ['Food Processor / Yam Pounder', 'Kitchen Tools & Accessories', 'Food processor/yam pounder; matched to the supplied 5L food processor price.', 16500],
  ['Toilet Rack', 'Home Organization', 'Bathroom/toilet storage rack.', 16000],
  ['RAF 4L 8-in-1 Electric Blender 800W', 'Kitchen Tools & Accessories', 'RAF electric blender, 4L, 8-in-1, 800W.', 59000],
  ['RAF Coffee Bean Grinder 80W', 'Kitchen Tools & Accessories', 'RAF coffee bean grinder, 80W.', 11000],
  ['GDTIMES 12-Inch Solar Rechargeable Fan', 'Home & Household', '12-inch rechargeable fan with solar panel.', 37000],
  ['RAF 2.0L Electric Kettle R.7816', 'Kitchen & Cookware', 'RAF R.7816 electric kettle; 2.0L.', 9500],
  ['RAF Foldable Travel Steam Iron', 'Home & Household', 'Foldable travel steam iron.', 13500],
  ['RAF 8L 1000W Food Processor / Yam Pounder R.7731', 'Kitchen Tools & Accessories', 'RAF R.7731 food processor; 8L, 1000W.', null],
  ['RAF 25L 3-in-1 Electric Oven, Air Fryer & Toaster', 'Kitchen & Cookware', 'RAF 25L electric oven, air fryer and toaster.', 126000],
  ['RAF 3-in-1 Cordless Rechargeable Food Processor R.2862', 'Kitchen Tools & Accessories', 'Cordless rechargeable food processor.', 45000],
  ['RAF 800W Electric Blender R.2842', 'Kitchen Tools & Accessories', 'RAF electric blender, 800W.', 15500],
  ['RAF Coffee Bean Grinder 400W', 'Kitchen Tools & Accessories', 'RAF coffee bean grinder, 400W.', 25000],
  ['RAF Citrus Juicer 45W 700ml', 'Kitchen Tools & Accessories', 'Citrus juicer, 45W, 700ml.', 12500],
  ['RAF 900W Vacuum Cleaner', 'Home & Household', 'RAF vacuum cleaner, 900W.', 90000],
  ['RAF 15L 1000W Food Processor / Yam Pounder R.7724', 'Kitchen Tools & Accessories', 'RAF food processor, 15L, 1000W.', 70000],
  ['3-Layer Plate Rack', 'Home Organization', 'Three-layer kitchen dish/plate rack.', 23500],
  ['Reusable Water Bottles', 'Water Bottles & Flasks', 'Reusable water bottles.', 4500],
  ['Kids Water Bottles', 'Water Bottles & Flasks', "Children's water bottles.", 4500],
  ['Thermal Flask Set', 'Water Bottles & Flasks', 'Insulated thermal flask set.', 4000],
  ['Electric Cooking Pot / Food Warmer', 'Kitchen & Cookware', 'Portable electric cooking and food-warming pot.', null],
  ['Vacuum Thermos Flasks', 'Water Bottles & Flasks', 'Vacuum thermos flasks.', 4000],
  ['Kids Water Bottle Set', 'Water Bottles & Flasks', "Children's water bottle set.", null],
  ['Stackable Storage Containers', 'Home Organization', 'Stackable storage containers.', null],
  ['Kitchen Storage Container Set', 'Food Storage', 'Kitchen and food storage container set.', null],
  ['Silicone Baking Moulds', 'Kitchen Tools & Accessories', 'Silicone baking moulds.', null],
  ['Food Flask Set with Spoon', 'Gifts & Souvenirs', 'Food flask set with spoon.', 14500],
  ['2.2L Electric Kettle', 'Kitchen Tools & Accessories', '2.2L electric kettle; Synyx model shown in image.', 10000],
  ['Temperature Flask', 'Water Bottles & Flasks', 'Temperature-display insulated flask.', 3500],
  ['Insulated Vacuum Flask', 'Water Bottles & Flasks', 'Insulated vacuum flask.', 1500],
  ['Cereal Dispenser', 'Food Storage', 'Cereal dispenser.', 2500],
  ['Cereal Dispenser', 'Food Storage', 'Cereal dispenser.', 2000],
  ['Bread Knife Set', 'Kitchen Tools & Accessories', 'Kitchen knife and bread knife set.', 1500],
  ['Double-Pole Clothes Drying Rack', 'Home Organization', 'Double-pole clothes drying rack.', null],
  ['Food Flask', 'Gifts & Souvenirs', 'Food flask/container.', 6000],
].map(([name, category, description, price], index) => ({
  id: String(index + 1), name: name as string, category: category as string, description: description as string,
  price: price as number | null, image: image(index + 1), stock: 12,
}));
