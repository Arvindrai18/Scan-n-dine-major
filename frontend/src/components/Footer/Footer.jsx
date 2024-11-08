import React from "react";
import { Link } from "react-router-dom";
import { FaInstagram, FaXTwitter, FaLinkedin } from "react-icons/fa6";
import {
  Typography,
  Button,
  IconButton,
} from "@material-tailwind/react";
import { assets } from "../../assets/assets";

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative mt-20 pt-8 pb-6">
      <div className="absolute top-0 left-0 right-0 bottom-0 bg-gradient-to-br from-gray-900 via-gray-800 to-black opacity-95"></div>
      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-wrap">
          <div className="w-full lg:w-6/12 px-4">
            <img
              src={assets.appXlogo}
              alt="Scan&Dine Logo"
              className="h-[150px] w-auto mb-4 transition-transform duration-300 hover:scale-105"
            />
            <Typography
              variant="lead"
              className="text-gray-300 mt-0 mb-2 text-sm lg:text-base"
            >
              Scan&Dine is a revolutionary restaurant management system that
              redefines the dining experience. Our innovative QR code technology
              empowers restaurants to streamline operations and delight customers
              with a seamless and efficient ordering process.
            </Typography>
            <div className="mt-6 flex gap-4">
              <IconButton color="white" className="rounded-full shadow-md hover:bg-[#ff6347] hover:shadow-current hover:text-white">
                <FaInstagram className="h-6 w-6" />
              </IconButton>
              <IconButton color="white" className="rounded-full shadow-md hover:bg-[#ff6347] hover:shadow-current hover:text-white">
                <FaXTwitter className="h-6 w-6" />
              </IconButton>
              <IconButton color="white" className="rounded-full shadow-md hover:bg-[#ff6347] hover:shadow-current hover:text-white">
                <FaLinkedin className="h-6 w-6" />
              </IconButton>
            </div>
          </div>
          <div className="w-full lg:w-6/12 px-4">
            <div className="flex flex-wrap items-top mb-6">
              <div className="w-full lg:w-4/12 px-4 ml-auto">
                <Typography
                  variant="small"
                  className="block mb-2 text-gray-100 font-bold"
                >
                  Company
                </Typography>
                <ul className="list-unstyled">
                  {['Home', 'About Us', 'Delivery', 'Privacy Policy'].map((item) => (
                    <li key={item}>
                      <Typography
                        as="a"
                        href="#"
                        variant="small"
                        className="text-gray-400 hover:text-white transition-colors duration-300"
                      >
                        {item}
                      </Typography>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="w-full lg:w-4/12 px-4">
                <Typography
                  variant="small"
                  className="block mb-2 text-gray-100 font-bold"
                >
                  Get in Touch
                </Typography>
                <ul className="list-unstyled">
                  <li>
                    <Typography
                      variant="small"
                      className="text-gray-400"
                    >
                      +1 263-837-3948
                    </Typography>
                  </li>
                  <li>
                    <Typography
                      variant="small"
                      className="text-gray-400"
                    >
                      contact@foodkart.com
                    </Typography>
                  </li>
                </ul>
              </div>
              <div className="w-full lg:w-4/12 px-4">
                <Typography
                  variant="small"
                  className="block mb-2 text-gray-100 font-bold"
                >
                  Partner with Us
                </Typography>
                <Typography
                  variant="small"
                  className="text-gray-400 mb-2"
                >
                  Want to become a partner?
                </Typography>
                <Button
                  color="red"
                  variant="gradient"
                  size="sm"
                  ripple={true}
                  className="rounded-full bg-[#ff6347]"
                >
                  <Link to="/partner" className="text-white ">
                    Click Here!
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
        <hr className="my-6 border-gray-700" />
        <div className="flex flex-wrap items-center md:justify-between justify-center">
          <div className="w-full md:w-4/12 px-4 mx-auto text-center">
            <Typography
              variant="small"
              className="text-gray-400"
            >
              Copyright © {currentYear} Scan&Dine.in - All Rights Reserved.
            </Typography>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;