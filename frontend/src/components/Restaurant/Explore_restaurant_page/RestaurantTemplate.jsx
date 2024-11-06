"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { Link, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { Spinner } from "@material-tailwind/react";
import { useGetRestaurantDetailsQuery } from "../../../slices/restaurantApitSlice";
import { addToCart } from "../../../slices/cartSlice";
import {
  ChefHat,
  Star,
  Clock,
  Home,
  Menu as MenuIcon,
  Info,
  Gift,
  MessageSquare,
  MapPin as LocationIcon,
  ChevronLeft,
  ChevronRight,
  Sun,
  Moon,
} from "lucide-react";
import {
  Button,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Typography,
  IconButton,
  ThemeProvider,
  Carousel,
} from "@material-tailwind/react";
import { useGetMenuByRestaurantIdQuery } from "../../../slices/menuApiSlice";
import { useGetOfferByRestaurantIdQuery } from "../../../slices/offerApiSlice";
import { useDispatch, useSelector } from "react-redux";
import { useGetFeedbackByRestaurantIdQuery } from "../../../slices/feedbackApiSlice";

// Default data for special offers, chefs, and feedbacks
const defaultData = {
  chefs: [
    {
      id: 1,
      name: "Chef John Doe",
      specialty: "Italian Cuisine",
      image:
        "https://www.onlinedegree.com/wp-content/uploads/2016/11/master_chef.jpg",
    },
    {
      id: 2,
      name: "Chef Jane Smith",
      specialty: "French Pastry",
      image:
        "https://www.shutterstock.com/image-photo/young-beautiful-asian-woman-chef-600nw-2311174449.jpg",
    },
  ],
};

const navItems = [
  { id: "home", icon: Home },
  { id: "menu", icon: MenuIcon },
  { id: "about", icon: Info },
  { id: "offers", icon: Gift },
  { id: "chefs", icon: ChefHat },
  { id: "feedback", icon: MessageSquare },
  { id: "location", icon: LocationIcon },
];

export default function RestaurantTemplate() {
  const { id } = useParams();

  const { cartItems } = useSelector((state) => state?.cart);
  console.log("cartItems", cartItems);
  const dispatch = useDispatch();
  const { data, isLoading, error } = useGetRestaurantDetailsQuery(id);
  console.log("restaurant", data);
  const { data: offers } = useGetOfferByRestaurantIdQuery(id);
  console.log("offers ", offers);
  const { data: feedback } = useGetFeedbackByRestaurantIdQuery(id);
  console.log("feedback", feedback);

  const {
    data: menu,
    isLoading: menuLoading,
    error: menuError,
  } = useGetMenuByRestaurantIdQuery(id);

  // State for restaurant data
  const [restaurantData, setRestaurantData] = useState(null);

  // States for UI interaction
  const [activeSection, setActiveSection] = useState("home");
  // const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Fetch restaurant data on component mount
  useEffect(() => {
    if (data && menu && offers && feedback) {
      setRestaurantData({
        ...defaultData,
        menuItems: menu.data.map((item) => ({
          id: item._id,
          name: item.itemName,
          description: item.description,
          price: item.price,
          image: item.image,
          category: item.category,
          isVeg: item.isVeg,
          isAvailable: item.isAvailable,
        })),
        specialOffers: offers.data.map((offer) => ({
          id: offer._id,
          name: offer.offerName,
          description: offer.offerDescription,
          image: offer.offerImage,
        })),
        feedbacks: feedback.data.map((fb) => ({
          id: fb._id,
          name: fb.name,
          comment: fb.review,
          rating: fb.rating,
        })),
        restaurantInfo: {
          name: data.data.name,
          address: data.data.address,
          phone: data.data.phoneNumber,
          email: data.data.email,
          hours: `${data.data.openingTime} - ${data.data.closingTime}`,
          isOpen: data.data.isOpen,
          description: data.data.description,
          avatar: data.data.avatar,
        },
      });
    }
  }, [data, menu, offers, feedback]);

  // Cart management functions
  const addToCartHandler = useCallback((item) => {
    dispatch(addToCart({ item, qty: 1 })), [dispatch];
  });

  // Navigation function
  const scrollTo = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Set up intersection observer for active section
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { threshold: 0.5 }
    );

    document.querySelectorAll("section").forEach((section) => {
      observer.observe(section);
    });

    return () => observer.disconnect();
  }, []);

  // Animated text component
  const AnimatedText = ({ text }) => {
    const letters = Array.from(text);
    const container = {
      hidden: { opacity: 0 },
      visible: (i = 1) => ({
        opacity: 1,
        transition: { staggerChildren: 0.03, delayChildren: 0.04 * i },
      }),
    };
    const child = {
      visible: {
        opacity: 1,
        x: 0,
        transition: {
          type: "spring",
          damping: 12,
          stiffness: 100,
        },
      },
      hidden: {
        opacity: 0,
        x: 20,
        transition: {
          type: "spring",
          damping: 12,
          stiffness: 100,
        },
      },
    };

    return (
      <motion.div
        style={{
          overflow: "hidden",
          display: "flex",
          justifyContent: "center",
        }}
        variants={container}
        initial="hidden"
        animate="visible"
      >
        {letters.map((letter, index) => (
          <motion.span key={index} variants={child}>
            {letter === " " ? "\u00A0" : letter}
          </motion.span>
        ))}
      </motion.div>
    );
  };

  // Section component with animation
  const Section = ({ id, title, children }) => {
    const [ref, inView] = useInView({
      threshold: 0.5,
      triggerOnce: true,
    });

    return (
      <section id={id} ref={ref} className="py-16 px-4 md:px-0">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
        >
          {title && (
            <Typography
              variant="h2"
              className="text-3xl font-bold mb-8 text-center"
            >
              {title}
            </Typography>
          )}
          {children}
        </motion.div>
      </section>
    );
  };

  // Render loading state if data is not yet fetched
  if (isLoading || !restaurantData) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spinner className="h-16 w-16 text-gray-900/50" />
      </div>
    );
  }

  if (error) {
    return <div>{toast.error(`Error: ${error}`)}</div>;
  }

  return (
    <ThemeProvider>
      <div
        className={`min-h-screen ${
          isDarkMode ? "dark bg-gray-900 text-white" : "bg-white text-gray-900"
        }`}
      >
        {/* Dark mode toggle */}
        <div className="fixed top-4 right-4 z-50">
          <IconButton
            className="rounded-full"
            onClick={() => setIsDarkMode(!isDarkMode)}
          >
            {isDarkMode ? (
              <Sun className="h-5 w-5" />
            ) : (
              <Moon className="h-5 w-5" />
            )}
          </IconButton>
        </div>

        {/* Floating navigation */}
        <div className="fixed top-1/2 right-4 transform -translate-y-1/2 z-40 p-4 bg-white/30 dark:bg-gray-800/30 backdrop-blur-lg rounded-xl border border-gray-200 dark:border-white/20 shadow-inner">
          <nav>
            <ul className="flex flex-col space-y-4">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <li key={item.id}>
                    <IconButton
                      variant={
                        activeSection === item.id ? "filled" : "outlined"
                      }
                      className={`rounded-full w-12 h-12 flex items-center justify-center transition-all duration-300 transform ${
                        activeSection === item.id
                          ? "scale-110"
                          : "hover:scale-105"
                      } ${
                        isDarkMode
                          ? "bg-gray-800 text-white hover:bg-gray-700"
                          : "bg-white text-gray-900 hover:bg-gray-100"
                      } shadow-md`}
                      color={isDarkMode ? "white" : "blue"}
                      onClick={() => scrollTo(item.id)}
                    >
                      <Icon className="h-5 w-5 transition-transform duration-300 hover:rotate-12" />
                      <span className="sr-only">
                        {item.id.charAt(0).toUpperCase() + item.id.slice(1)}
                      </span>
                    </IconButton>
                  </li>
                );
              })}
            </ul>
          </nav>
        </div>

        <main className="container mx-auto">
          <Link to="/">
            <Button
              variant="outlined"
              color={isDarkMode ? "white" : "blue"}
              className="mx-auto mt-4"
            >
              Go back
            </Button>
          </Link>

          {/* Home Section */}
          <Section id="home" title="">
            <div
              className="text-center bg-cover bg-center h-screen flex flex-col justify-center items-center"
              style={{
                backgroundImage: `url(${restaurantData.restaurantInfo.avatar})`,
              }}
            >
              <div className="bg-black bg-opacity-50 p-8 rounded-lg text-white">
                <AnimatedText
                  text={`Welcome to ${restaurantData.restaurantInfo.name}`}
                />
                <AnimatedText text="Experience Culinary Excellence" />
                <div className="mt-8 space-x-4">
                  <Button
                    onClick={() => scrollTo("menu")}
                    color={isDarkMode ? "white" : "blue"}
                    size="lg"
                    ripple={true}
                    className="px-6 hover:bg-opacity-80 transition-all duration-300"
                  >
                    Our Menu
                  </Button>
                </div>
              </div>
            </div>
          </Section>

          {menuLoading && <Spinner className="h-16 w-16 text-gray-900/50" />}
          {menuError && toast.error(`Something went wrong`)}
          <Section id="menu" title="Our Menu">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {restaurantData.menuItems.map((item) => (
                <Card
                  key={item.id}
                  className={`w-full shadow-lg ${
                    isDarkMode ? "bg-gray-800 text-white" : "bg-white"
                  }`}
                >
                  <CardBody>
                    <div className="relative h-48 overflow-hidden rounded-sm">
                      <Carousel
                        className="rounded-xl"
                        autoplay={true}
                        loop={true}
                        autoplayDelay={5000}
                        navigation={({
                          setActiveIndex,
                          activeIndex,
                          length,
                        }) => (
                          <div className="absolute bottom-4 left-2/4 z-50 flex -translate-x-2/4 gap-2">
                            {new Array(length).fill("").map((_, i) => (
                              <span
                                key={i}
                                className={`block h-1 cursor-pointer rounded-2xl transition-all content-[''] ${
                                  activeIndex === i
                                    ? "w-8 bg-white"
                                    : "w-4 bg-white/50"
                                }`}
                                onClick={() => setActiveIndex(i)}
                              />
                            ))}
                          </div>
                        )}
                      >
                        {item.image.map((img, index) => (
                          <img
                            key={index}
                            src={img.url}
                            alt={`${item.name} - view ${index + 1}`}
                            className="h-full w-full object-cover"
                          />
                        ))}
                      </Carousel>
                    </div>
                    <div className="mt-4">
                      <Typography variant="h5">{item.name}</Typography>
                      <Typography
                        color={isDarkMode ? "gray" : "blue-gray"}
                        className="mt-1 line-clamp-2"
                      >
                        {item.description}
                      </Typography>
                    </div>
                    <Typography
                      variant="h6"
                      color={isDarkMode ? "gray" : "blue-gray"}
                      className="mt-2"
                    >
                      ${item.price.toFixed(2)}
                    </Typography>
                    <Typography className="flex justify-end mx-0" variant="h6">
                      {item.isVeg ? (
                        <p className="text-green-600">Veg</p> // Green for Veg
                      ) : (
                        <p className="text-red-600">Non Veg</p> // Red for Non Veg
                      )}
                    </Typography>

                    <Typography className="flex justify-end mx-0" variant="h6">
                      {item.isAvailable ? (
                        <p className="text-green-600">Available</p> // Green for Available
                      ) : (
                        <p className="text-gray-500">Not Available</p> // Gray for Not Available
                      )}
                    </Typography>
                  </CardBody>
                  {/* <CardFooter className="flex justify-between pt-2">
                    <Button
                      onClick={() => addToCartHandler(item)}
                      color={isDarkMode ? "white" : "orange"}
                      size="sm"
                      ripple={true}
                      className="hover:bg-opacity-80 transition-all duration-300"
                    >
                      Add to Cart
                    </Button>
                  </CardFooter> */}
                </Card>
              ))}
            </div>
          </Section>

          {/* About Section */}
          <Section id="about" title="About Us">
            <Card
              className={`${
                isDarkMode ? "bg-gray-800 text-white" : "bg-white"
              } border border-gray-200 shadow-xl`}
            >
              <CardBody>
                <Typography className="text-lg leading-relaxed">
                  {restaurantData.restaurantInfo.description
                    ? restaurantData.restaurantInfo.description
                    : "Description not available"}
                </Typography>
              </CardBody>
            </Card>
          </Section>

          {/* Special Offers Section */}
          <Section id="offers" title="Special Offers">
            <Carousel
              className="rounded-xl"
              navigation={({ setActiveIndex, activeIndex, length }) => (
                <div className="absolute bottom-4 left-2/4 z-50 flex -translate-x-2/4 gap-2">
                  {new Array(length).fill("").map((_, i) => (
                    <span
                      key={i}
                      className={`block h-1 cursor-pointer rounded-2xl transition-all content-[''] ${
                        activeIndex === i ? "w-8 bg-white" : "w-4 bg-white/50"
                      }`}
                      onClick={() => setActiveIndex(i)}
                    />
                  ))}
                </div>
              )}
              prevArrow={({ handlePrev }) => (
                <IconButton
                  variant="text"
                  color="white"
                  size="lg"
                  onClick={handlePrev}
                  className="!absolute top-2/4 left-4 -translate-y-2/4"
                >
                  <ChevronLeft strokeWidth={2} className="w-6 h-6" />
                </IconButton>
              )}
              nextArrow={({ handleNext }) => (
                <IconButton
                  variant="text"
                  color="white"
                  size="lg"
                  onClick={handleNext}
                  className="!absolute top-2/4 !right-4 -translate-y-2/4"
                >
                  <ChevronRight strokeWidth={2} className="w-6 h-6" />
                </IconButton>
              )}
            >
              {restaurantData.specialOffers.map((offer) => (
                <div key={offer.id} className="relative h-full w-full">
                  <div className="h-96 w-full overflow-hidden">
                    <img
                      src={offer.image}
                      alt={offer.name}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="absolute inset-0 grid h-full w-full place-items-center bg-black/75">
                    <div className="w-3/4 text-center md:w-2/4">
                      <Typography
                        variant="h1"
                        color="white"
                        className="mb-4 text-3xl md:text-4xl lg:text-5xl"
                      >
                        {offer.name}
                      </Typography>
                      <Typography
                        variant="lead"
                        color="white"
                        className="mb-12 opacity-80"
                      >
                        {offer.description}
                      </Typography>
                    </div>
                  </div>
                </div>
              ))}
            </Carousel>
          </Section>

          {/* Chefs Section */}
          <Section id="chefs" title="Our Chefs">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {restaurantData.chefs.map((chef) => (
                <Card
                  key={chef.id}
                  className={`${
                    isDarkMode ? "bg-gray-800 text-white" : "bg-white"
                  } border border-gray-200 shadow-xl`}
                >
                  <CardHeader>
                    <Typography variant="h5">{chef.name}</Typography>
                    <Typography color={isDarkMode ? "gray" : "blue-gray"}>
                      {chef.specialty}
                    </Typography>
                  </CardHeader>
                  <CardBody className="flex flex-col md:flex-row items-center">
                    <img
                      src={chef.image}
                      alt={chef.name}
                      className="w-32 h-32 rounded-full mr-4 mb-4 md:mb-0"
                    />
                    <div className="text-center md:text-left">
                      <ChefHat className="w-6 h-6 mb-2 text-blue-500 mx-auto md:mx-0" />
                      <Typography>Years of Experience: 10+</Typography>
                      <Typography>Signature Dish: To be announced</Typography>
                    </div>
                  </CardBody>
                </Card>
              ))}
            </div>
          </Section>

          {/* Feedback Section */}
          <Section id="feedback" title="Customer Feedback">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {restaurantData.feedbacks.length > 0 ? (
                restaurantData.feedbacks.map((feedback, id) => (
                  <Card
                    key={feedback.id}
                    className={`${
                      isDarkMode ? "bg-gray-800 text-white" : "bg-white"
                    } border border-gray-200 shadow-xl`}
                  >
                    <CardBody>
                      <Typography variant="h5 p-3">{feedback.name}</Typography>
                      <div className="flex">
                        {[...Array(feedback.rating)].map((_, i) => (
                          <Star
                            key={i}
                            className="w-5 h-5 fill-yellow-400 text-yellow-400"
                          />
                        ))}
                      </div>
                      <Typography>{feedback.comment}</Typography>
                    </CardBody>
                  </Card>
                ))
              ) : (
                <h3>No Reviews</h3>
              )}
            </div>
          </Section>

          {/* Location Section */}
          <Section id="location" title="Our Location">
            <Card
              className={`${
                isDarkMode ? "bg-gray-800 text-white" : "bg-white"
              } border border-gray-200 shadow-xl`}
            >
              <CardBody className="flex flex-col md:flex-row items-center">
                <div className="w-full md:w-1/2 mb-4 md:mb-0 md:mr-4">
                  <img
                    src="https://maps.zomato.com/php/staticmap?center=28.6745158493,77.1019550831&maptype=zomato&markers=28.6745158493,77.1019550831,pin_res32&sensor=false&scale=2&zoom=16&language=en&size=240x150&size=400x240&size=525x300"
                    alt="Restaurant Location"
                    className="w-full h-64 object-cover rounded-md"
                  />
                </div>
                <div className="w-full md:w-1/2">
                  <Typography variant="h5" className="mb-2">
                    Visit Us
                  </Typography>
                  <Typography className="flex items-center mb-2">
                    <LocationIcon className="w-5 h-5 mr-2 text-blue-500" />
                    {restaurantData.restaurantInfo.address}
                  </Typography>
                  <Typography className="flex items-center mb-2">
                    <Clock className="w-5 h-5 mr-2 text-blue-500" />
                    {restaurantData.restaurantInfo.hours}
                  </Typography>
                  <Typography className="flex items-center mb-2">
                    {restaurantData.restaurantInfo.isOpen ? (
                      <span className="text-green-500 font-bold">Open Now</span>
                    ) : (
                      <span className="text-red-500 font-bold">Closed</span>
                    )}
                  </Typography>
                </div>
              </CardBody>
            </Card>
          </Section>
        </main>
      </div>
    </ThemeProvider>
  );
}