import { useEffect, useRef, useState,useContext } from 'react';
import '../style/DrivewayDetailed.css';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { GoogleMap, LoadScript, LoadScriptNext, Marker } from '@react-google-maps/api';
// import { drivewayService } from '../services/drivewayService';
import { FaLocationDot } from "react-icons/fa6";
import { FaMapMarkerAlt } from "react-icons/fa";
import { RiWalkFill } from "react-icons/ri";
import { MdAttachMoney } from "react-icons/md";
import { FaRegCheckSquare } from "react-icons/fa";
import { FiHelpCircle } from "react-icons/fi";
import { FaGooglePay } from "react-icons/fa";
import { FaCcApplePay } from "react-icons/fa";
import { RiVisaFill } from "react-icons/ri";
import { FcGoogle } from "react-icons/fc";
import { FaApplePay } from "react-icons/fa6";
import { BsPaypal } from "react-icons/bs";
import { LiaCcAmex } from "react-icons/lia";
import { FaCcMastercard } from "react-icons/fa";
import { address, h2, p } from 'framer-motion/client';
import { BsCurrencyDollar } from "react-icons/bs";
import { FaRegArrowAltCircleLeft } from "react-icons/fa";
import { FaRegArrowAltCircleRight } from "react-icons/fa";
import { MdArrowCircleRight } from "react-icons/md";
import { MdArrowCircleLeft } from "react-icons/md";
import { GrMoney } from "react-icons/gr";
import { CiLocationOn } from "react-icons/ci";
import { MdOutlineCheck } from "react-icons/md";
import { useDrivewayDetailed } from '../hooks/useDrivewayDetailed';

export function DrivewayDetailed(){
      const { driveway, setDriveway, images, coords, setCoords, showRentalRules,
         setShowRentalRules, isLoading, setIsLoading, curImage, setCurImage,
          message, setMessage, errorMessage, setErrorMessage,handleCurImage, handleCurImageBack,toggleRentalRules,sendHome
        } = useDrivewayDetailed();
          const navigate = useNavigate();

      
        return (
  <>
    {isLoading && (
      <div style={{position:'fixed',left:0,top:0,right:0,bottom:0,background:'rgba(255,255,255,0.7)',display:'flex',alignItems:'center',justifyContent:'center',zIndex:9999}}>
        <div style={{padding:14,background:'#fff',borderRadius:10,boxShadow:'0 6px 20px rgba(0,0,0,0.12)'}}>Loading driveway…</div>
      </div>
    )}

    <div className="top">
      <img
        src="/logo.png"
        alt="logo"
        className="logoDash"
        onClick={sendHome}
      />
    </div>

    {message && (
      <div style={{
        position: 'fixed',
        top: 20,
        right: 20,
        zIndex: 10000,
        background: 'rgba(0,0,0,0.8)',
        color: '#fff',
        padding: '10px 14px',
        borderRadius: 8,
        boxShadow: '0 6px 20px rgba(0,0,0,0.12)',
        maxWidth: 360,
        pointerEvents: 'auto'
      }}>
        {message}
      </div>
    )}

    <div className="detailPageContainer">

    
      <section className="imagesArea">
        <div className="map">
          {coords && (
            <LoadScriptNext googleMapsApiKey="AIzaSyBCuQJ5ztmnPHGjtp8yXJ3_tzufzchq3jg">
              <GoogleMap
                mapContainerStyle={{ width: "100%", height: "100%" }}
                center={coords}
                zoom={15}
                options={{
                  zoomControl: true,
                  scrollwheel: true,
                  draggable: true,
                  disableDoubleClickZoom: false,
                  fullscreenControl: true,
                  mapTypeControl: true,
                  streetViewControl: true,
                  gestureHandling: "greedy"
                }}
              >
                <Marker position={coords} />
              </GoogleMap>
            </LoadScriptNext>
          )}
        </div>

        <div className="image-wrapper">
          <MdArrowCircleLeft className="arrowLeft" onClick={handleCurImageBack} />
          <img key={curImage} src={images[curImage]} alt="" className="pictures fade" />
          <MdArrowCircleRight className="arrowRight" onClick={handleCurImage} />

          <div className="image-index">
            {curImage + 1} / {images.length}
          </div>
        </div>
      </section>

      <section className="middleArea">
        <div className="details">
          <p className="locationInfo">
            <FaMapMarkerAlt className="locationIcon" />
            {driveway?.publicDisplay}
            <div className="tooltip-container">
              <FiHelpCircle className="infoIcon" />
              <span className="tooltip-text">Full address will be provided via email after booking</span>
            </div>
          </p>

          <p className="walkInfo">
            <RiWalkFill className="walkIcon" />
            <div>{driveway?.walk} Min</div>
          </p>

          <p className="priceInfo">
            <GrMoney className="moneyIcon" />
            <div><MdAttachMoney /> {driveway?.price} (USD)</div>
          </p>

          <p className="ratingInfo">
            <img
              src="https://tse1.mm.bing.net/th/id/OIP.Qrq7XBSs71OgklY--yU_uQHaHa?w=169&h=180&c=7&r=0&o=7&dpr=1.3&pid=1.7&rm=3"
              alt=""
              className="starIcon"
            />
            4.5
          </p>
        </div>

        <section className="middleRight">
          <div className="cancelBox">
            <p className="rowCancel">
              <FaRegCheckSquare />
              Free Cancelation
              <div className="tooltip-container">
                <FiHelpCircle className="infoIcon" />
                <span className="tooltip-text">Full refund if deleted before 24 hours from parking time</span>
              </div>
            </p>

            <p className="rowCancel">
              <FaRegCheckSquare />
              Guaranteed parking
            </p>
          </div>

          <div className="paymantIcons">
            <FaApplePay />
            <RiVisaFill className="visa" />
            <img src="https://tse2.mm.bing.net/th/id/OIP.ugrhTJ4gxQKWstWBQkLYyQHaHa?o=7&cb=ucfimg2&rm=3&ucfimg=1&rs=1&pid=ImgDetMain&o=7&rm=3" alt="" className="googlePay" />
            <LiaCcAmex className="amex" />
            <FcGoogle className="google" />
            <BsPaypal className="paypal" />
            <img src="https://i.pinimg.com/originals/56/fd/48/56fd486a48ff235156b8773c238f8da9.png" alt="" className="master" />
            <p className="more">+more</p>
          </div>

          <button className="availBtn">Reserve Now</button>
        </section>
      </section>

      <div className="line4"></div>

      {driveway?.description && (
        <>
          <p className="abtDriveway">About this driveway</p>
          <p className="describe">{driveway.description}</p>
        </>
      )}

      {/* RENTAL RULES + DRIVEWAY RULES (MOVED INSIDE CONTAINER) */}
      <section className="rulesSection">

        <div className="rental-rules-container">
          <div className="rules-icon-wrapper" onClick={toggleRentalRules}>
            <FiHelpCircle className="rules-icon" />
            <span className="rules-icon-text">Rental Rules</span>
          </div>

          {showRentalRules && (
            <div className="rental-rules-popup">
              <div className="rulesGrid">
                {[
                  "Arrive up to 30 minutes before start of game or event",
                  "Park only in the assigned driveway or spot",
                  "Respect the booking time and leave on schedule",
                  "Follow any instructions provided by the host",
                  "Keep noise to a minimum when arriving or leaving",
                  "Use only the registered vehicle for your booking",
                  "No overnight parking unless the listing allows it",
                  "Do not leave trash or belongings behind",
                  "Report any issues immediately through the app",
                  "No illegal or unsafe activities on the property",
                  "Cancellations must follow the platform policy"
                ].map((rule, i) => (
                  <div key={i} className="rule">
                    <span className="rule-icon">✓</span>
                    <span>{rule}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {(driveway?.rules?.length ?? 0) > 0 && (
          <div className="rulesBox" style={{ marginTop: '20px' }}>
            <h3 className="rules-title">Driveway-Specific Rules</h3>
            <div className="rulesGrid">
              {driveway?.rules.map((rule, index) => (
                <div key={index} className="rule">
                  <span className="rule-icon">✓</span>
                  <span>{rule}</span>
                </div>
              ))}
            </div>
          </div>
        )}

      </section>

    </div>
  </>
);



}