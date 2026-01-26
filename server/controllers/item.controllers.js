import Item from "../models/item.model.js";
import Shop from "../models/shop.model.js";
import uploadOnCloudinary from "../utils/cloudinary.js";

export const addItem = async (req ,res)=>{
    try {
        const {name, category ,foodType, price} = req.body
        
       
    if (!req.file) {
      return res.status(400).json({ message: "Image is required" });
    }

    const image = await uploadOnCloudinary(req.file.path);

    if (!image) {
      return res.status(500).json({ message: "Image upload failed" });
    }
        const shop = await Shop.findOne({owner:req.userId})
        if(!shop){
            return res.status(400).json({message:` shop not found ${error}`})
        }
        
        const item =await Item.create({
            name, category ,foodType, price,image, shop:shop._id
        })
        shop.items.push(item._id)
        await shop.save()
        await shop.populate("items owner")
         return res.status(201).json(shop)

    } catch (error) {
         return res.status(500).json({message:`add item error ${error}`})
        
    }
}

export const editItem = async (req,res)=>{
    try {
        const itemId = req.params.itemId
        const{name, category ,foodType, price}=req.body

         const updateData = {
      name,
      category,
      foodType,
      price,
    };
        
        let image;
        if(req.file){
            image=await uploadOnCloudinary(req.file.path)
           updateData.image = image;   
          
        }
        const item = await Item.findByIdAndUpdate(itemId,updateData,
            {new:true})

        if(!item){
            return res.status(400).json({message:` item not found `})
        }
        const shop=await Shop.findOne({owner:req.userId}).populate("items")
        return res.status(201).json(shop)
    } catch (error) {
        return res.status(500).json({message:`edit item error ${error}`})
    }
}

export const getItemById = async (req, res) => {
  try {
    const itemId = req.params.itemId;
    const item = await Item.findById(itemId);
    if (!item) {
      return res.status(400).json({ message: "item not found" });
    }
    return res.status(200).json(item);
  } catch (error) {
    return res.status(500).json({ message: `get item error ${error}` });
  }
};

export const deleteItem = async (req, res) => {
  try {
    const { itemId } = req.params;

    const item = await Item.findByIdAndDelete(itemId);
    if (!item) {
      return res.status(400).json({ message: "item not found" });
    }

    const shop = await Shop.findOne({ owner: req.userId });
    if (!shop) {
      return res.status(400).json({ message: "shop not found" });
    }

   
    shop.items = shop.items.filter(
      (id) => id.toString() !== item._id.toString()
    );

    await shop.save();

    await shop.populate({
      path: "items",
      options: { sort: { updatedAt: -1 } }, // recent first
    });

    return res.status(200).json(shop);
  } catch (error) {
    return res.status(500).json({ message: `delete item error ${error}` });
  }
};


