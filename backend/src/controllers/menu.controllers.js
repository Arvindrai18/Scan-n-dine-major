import { Menu } from "../models/menu.models.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"
import { uploadOnCloudinary } from "../utils/cloudinary.js"
import { ApiFeatures } from "../utils/ApiFeatures.js"
import mongoose from "mongoose"


const getMenuItem = asyncHandler(async (req, res) => {
    const { resid } = req.params

    const apiFeatures = new ApiFeatures(Menu.find({ restaurantId: resid }), req.query)
        .searchMenu()

    const menu = await apiFeatures.query

    if (!menu || menu.length === 0) {
        throw new ApiError(404, "Items not found")
    }


    return res
        .status(200)
        .json(new ApiResponse(200, menu, "Menu fetched successfully"))
})

// get menu by id
const getMenuById = asyncHandler(async (req, res) => {
    const { resid, itemid } = req.params

    const menu = await Menu.findOne({ _id: itemid, restaurantId: resid })

    if (menu.restaurantId !== resid) {
        throw new ApiError(401, "Not accessible")
    }

    if (!menu) {
        throw new ApiError(404, "Item does not found")
    }

    return res
        .status(200)
        .json(new ApiResponse(200, menu, "Item fetched successfully"))
})

// create menu
const createMenuItem = asyncHandler(async (req, res) => {
    const { itemName, price, description, category, isVeg, isAvailable } = req.body

    if (
        [itemName, price, description, category, isVeg].some((field) => field?.trim() === "")
    ) { throw new ApiError(400, "All fields are required") }

    let imageLocalPath = []
    imageLocalPath = req.files.image
    //console.log(imageLocalPath)

    if (!imageLocalPath) {
        throw new ApiError(401, "Image is required")
    }
    let imageArray = []
    for (let i = 0; i < imageLocalPath.length; i++) {
        let imageLinks = imageLocalPath[i]?.path;
        const result = await uploadOnCloudinary(imageLinks)
        imageArray.push({
            publicId: result.public_id,
            url: result.url
        })
    }

    const menuItem = await Menu.create({
        restaurantId: req.params.resid,
        itemName,
        price,
        image: imageArray,
        price,
        description,
        category,
        isVeg,
        isAvailable,
    })
    const createdMenuItem = await Menu.findById(menuItem._id)

    if (!createdMenuItem) {
        throw new ApiError(500, "Something went wrong while adding menu")
    }

    return res
        .status(201)
        .json(new ApiResponse(201, createdMenuItem, "Menu addedd successfully"))
})

const updateMenuItem = asyncHandler(async (req, res) => {
    const { resid, itemid } = req.params
    const { price, description, isAvailable } = req.body

    if (!price && !description && !isAvailable) {
        throw new ApiError(400, "All fields are required")
    }

    const menuItem = await Menu.findByIdAndUpdate({ restaurantId: resid, _id: itemid }, {
        $set: {
            price,
            description,
            isAvailable
        }
    }, {
        new: true
    })

    return res
        .status(200)
        .json(new ApiResponse(200, menuItem, "Item updated successfully."))
})

const deleteMenuItem = asyncHandler(async (req, res) => {
    const { resid, itemid } = req.params
    const menuItem = await Menu.findByIdAndDelete({ restaurnatId: resid, _id: itemid })

    if (!menuItem) {
        throw new ApiError(400, "Item not found")
    }

    return res
        .status(200)
        .json(new ApiResponse(200, {}, "Menu item deleted successfully"))
})

// menuReview
const addMenuReview = asyncHandler(async (req, res) => {
    const { resid, menuid } = req.params
    const userId = req.user?._id
    const { name, rating, review } = req.body

    if (rating < 0 || rating > 5) {
        throw new ApiError(400, "Rating must be between 1 and 5.")
    }

    const menuItem = await Menu.findById(menuid);

    if (!menuItem) {
        throw new ApiError(404, "Menu item not found")
    }

    if (menuItem.restaurantId.toString() !== resid) {
        throw new ApiError(401, "Access Denied")
    }
    const alreadyReviewed = menuItem.reviews.find(
        (review) => review.user.toString() === userId.toString()
    );

    if (alreadyReviewed) {
        throw new ApiError(400, "You have already reviewed this item.")
    }

    const newReview = {
        user: userId,
        name,
        rating,
        review,
    };

    menuItem.reviews.push(newReview);

    let avg = 0
    menuItem.reviews.forEach((rev) => {
        avg += rev.rating
    })

    menuItem.rating = avg / menuItem.reviews.length

    await menuItem.save({ validateBeforeSave: false });

    return res
        .status(200)
        .json(new ApiResponse(200, {}, "Review added successfully"))
})

const getMenuReviews = asyncHandler(async (req, res) => {
    const { resid, menuid } = req.params
    const menuItem = await Menu.findById(menuid)

    if (!menuItem) {
        throw new ApiError(404, "Item not found")
    }

    if (menuItem.restaurantId.toString() !== resid) {
        throw new ApiError(401, "Access Denied")
    }

    return res
        .status(200)
        .json(new ApiResponse(200, menuItem.reviews, "Review fetched successfully."))
})

export {
    getMenuItem,
    createMenuItem,
    updateMenuItem,
    deleteMenuItem,
    getMenuById,
    addMenuReview,
    getMenuReviews,
}