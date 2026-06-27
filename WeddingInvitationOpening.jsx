import React, { useState } from 'react';

/**
 * WeddingInvitationOpening Component
 * 
 * A premium, elegant, and romantic onboarding screen for an online wedding invitation.
 * Features a 3D deep red envelope with a photorealistic gold wax seal image button, 
 * floating white rose petals, and subtle paper texture background.
 *
 * Props:
 * @param {string} guestName - Custom guest greeting (e.g., "Kính gửi Anh Minh").
 * @param {Function} onOpen - Optional callback triggered after the envelope open animation finishes (after 1000ms).
 */
export default function WeddingInvitationOpening({ 
  guestName = 'Quý khách', 
  invitePrefix = 'TRÂN TRỌNG KÍNH MỜI', 
  onOpen 
}) {
  const [isOpening, setIsOpening] = useState(false);
  const [cardPulled, setCardPulled] = useState(false);
  const [cardFront, setCardFront] = useState(false);
  const [cardZoomed, setCardZoomed] = useState(false);
  const [isFadingOut, setIsFadingOut] = useState(false);
  const [isHidden, setIsHidden] = useState(false);

  React.useEffect(() => {
    document.body.classList.add('envelope-active');
    document.documentElement.classList.add('envelope-active');
    return () => {
      document.body.classList.remove('envelope-active');
      document.documentElement.classList.remove('envelope-active');
    };
  }, []);

  const handleOpen = () => {
    if (isOpening) return;
    setIsOpening(true);

    // Trigger onOpen callback when the card starts zooming into the main page.
    if (onOpen) {
      setTimeout(() => {
        onOpen();
      }, 5900);
    }

    // 1. Pull card after the flap opens.
    setTimeout(() => {
      setCardPulled(true);
    }, 650);

    // 2. Slide card down, expand 10%, then hold it like a revealed invitation.
    setTimeout(() => {
      setCardFront(true);
    }, 1750);

    // 3. Zoom card forward after a 3s hold to transition into the main page.
    setTimeout(() => {
      setCardZoomed(true);
    }, 5900);

    // Remove scroll lock after the zoom starts.
    setTimeout(() => {
      document.body.classList.remove('envelope-active');
      document.documentElement.classList.remove('envelope-active');
    }, 6500);

    // Start fade out transition after the zoom starts.
    setTimeout(() => {
      setIsFadingOut(true);
    }, 6500);

    // Hide from DOM completely after animation completes.
    setTimeout(() => {
      setIsHidden(true);
    }, 7800);
  };

  if (isHidden) return null;

  return (
    <>
      <style>{`
        :root {
          --bg-ivory: #FAF7F1;
          --bg-cream: #F3EBDD;
          --champagne-gold: #C9A46A;
          --soft-gold: #E2D2B6;
          --light-gold: #F0D493;
          --name-gold: #B89157;
          --deep-red: #8F1618;
          --red-main: #A3191B;
          --dark-red: #6F1012;
          --text-main: #3A332C;
          --text-muted: #8A7A68;
          --label-text: #5F554C;
          --white: #FFFFFF;

          /* Envelope Card Layout Variables */
          --card-padding-outer: 12px;
          --card-padding-inner: 8px 12px;
          --card-font-monogram: clamp(20px, 3.5vh, 28px);
          --card-margin-monogram: 2px;
          --card-font-std: clamp(24px, 4vh, 32px);
          --card-margin-std: 4px;
          --card-margin-divider: 4px 0 8px;
          --card-width-divider: 50px;
          --card-font-prefix: clamp(8px, 1.2vh, 10px);
          --card-font-guest: clamp(15px, 2.2vh, 20px);
          --card-margin-guest: 3px 0 6px;
          --card-font-couple: clamp(14px, 2vh, 18px);
          --card-margin-couple: 4px 0;
          --card-font-date: clamp(8px, 1.2vh, 9px);
          --card-margin-date: 6px;
        }

        body.envelope-active,
        html.envelope-active {
          overflow: hidden !important;
          height: 100% !important;
          width: 100% !important;
        }

        .wedding-opening {
          position: fixed;
          inset: 0;
          z-index: 1000;
          display: flex;
          align-items: center;
          justify-content: center;
          background-color: var(--bg-ivory);
          transition: opacity 1.2s ease, visibility 1.2s ease;
          overflow: hidden; /* Prevent scrolling entirely */
          padding: 24px;
          box-sizing: border-box;
        }

        /* Subtle Paper Texture overlay */
        .wedding-opening::before {
          content: "";
          position: absolute;
          inset: 0;
          background-image: 
            radial-gradient(rgba(58,51,44,0.015) 1px, transparent 0),
            radial-gradient(rgba(58,51,44,0.01) 1px, transparent 0);
          background-size: 8px 8px;
          background-position: 0 0, 4px 4px;
          opacity: 0.16;
          pointer-events: none;
          z-index: 2;
        }

        /* Floral Background Image */
        .floral-background {
          position: absolute;
          inset: 0;
          background: var(--bg-ivory) url('/assets/decor/opening-bg.jpg') no-repeat center center;
          background-size: cover;
          z-index: 1;
          pointer-events: none;
        }

        /* Petals Layer (Falling/floating white petals) */
        .petals-layer {
          position: absolute;
          inset: 0;
          pointer-events: none;
          z-index: 2;
          overflow: hidden;
        }

        .petal {
          position: absolute;
          background: linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(255,245,245,0.9) 60%, rgba(245,214,214,0.85) 100%);
          width: 16px;
          height: 20px;
          border-radius: 50% 10% 50% 50%;
          opacity: 0;
          pointer-events: none;
          z-index: 2;
          filter: drop-shadow(0 2px 4px rgba(0,0,0,0.05));
        }
        .petal-1 { left: 10%; top: -5%; animation: petalFloat1 18s linear infinite; }
        .petal-2 { left: 30%; top: -5%; animation: petalFloat2 22s linear infinite 3s; width: 12px; height: 16px; }
        .petal-3 { left: 55%; top: -5%; animation: petalFloat3 20s linear infinite 1s; width: 18px; height: 22px; }
        .petal-4 { left: 75%; top: -5%; animation: petalFloat1 25s linear infinite 5s; width: 14px; height: 18px; }
        .petal-5 { left: 90%; top: -5%; animation: petalFloat2 16s linear infinite 2s; }
        .petal-6 { left: 20%; top: -5%; animation: petalFloat3 24s linear infinite 6s; width: 13px; height: 17px; }
        .petal-7 { left: 45%; top: -5%; animation: petalFloat1 21s linear infinite 4s; }
        .petal-8 { left: 80%; top: -5%; animation: petalFloat2 19s linear infinite 7s; }

        /* Centered typography */
        .opening-content {
          position: relative;
          z-index: 3;
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
          max-width: 980px;
          width: 100%;
          margin: auto; /* Centering helper that respects overflow */
        }

        .monogram {
          font-family: "Great Vibes", "Allura", cursive;
          font-size: clamp(38px, 5vw, 64px);
          font-weight: 400;
          color: var(--champagne-gold);
          letter-spacing: 0;
          text-align: center;
          margin-bottom: 12px;
          line-height: 1;
          animation: fadeUpMonogram 900ms ease-out both;
        }

        .invite-label {
          font-family: "Montserrat", "Inter", sans-serif;
          font-size: 13px;
          font-weight: 500;
          letter-spacing: 4px;
          text-transform: uppercase;
          color: var(--label-text);
          margin: 0;
          text-align: center;
          animation: fadeUpLabel 900ms ease-out both 150ms;
        }

        .gold-divider {
          position: relative;
          width: 120px;
          height: 12px;
          margin: 14px auto 0;
          background: transparent;
          animation: fadeInDivider 900ms ease-out both 250ms;
        }

        .gold-divider::before {
          content: "";
          position: absolute;
          left: 0;
          right: 0;
          top: 50%;
          height: 1px;
          transform: translateY(-50%);
          background: linear-gradient(
            90deg,
            transparent 0%,
            var(--champagne-gold) 35%,
            transparent 35%,
            transparent 65%,
            var(--champagne-gold) 65%,
            transparent 100%
          );
        }

        .gold-divider::after {
          content: "♥";
          position: absolute;
          left: 50%;
          top: 50%;
          transform: translate(-50%, -50%);
          color: var(--champagne-gold);
          background: transparent;
          padding: 0;
          font-size: 10px;
          line-height: 1;
        }

        /* Shorter heart divider under the envelope */
        .gold-divider.small {
          width: 80px;
          margin-top: 34px;
          animation: fadeInDivider 900ms ease-out both 700ms;
        }

        .gold-divider.small::before {
          background: linear-gradient(
            90deg,
            transparent 0%,
            var(--champagne-gold) 30%,
            transparent 30%,
            transparent 70%,
            var(--champagne-gold) 70%,
            transparent 100%
          );
        }

        .couple-name {
          font-family: "Cormorant Garamond", "Playfair Display", serif;
          font-size: clamp(42px, 6vw, 88px);
          font-weight: 400;
          line-height: 1.05;
          letter-spacing: 0.5px;
          color: var(--name-gold);
          text-align: center;
          margin-top: 18px;
          margin-bottom: 32px;
          animation: fadeUpName 1000ms ease-out both 350ms;
        }

        .couple-name .ampersand {
          font-style: italic;
          color: var(--champagne-gold);
        }

        .opening-subtitle {
          font-family: "Cormorant Garamond", "Playfair Display", serif;
          font-size: clamp(18px, 2vw, 24px);
          font-weight: 400;
          line-height: 1.4;
          color: #7D6E60;
          text-align: center;
          max-width: 460px;
          margin-top: 34px;
          animation: fadeInSubtitle 1000ms ease-out both 800ms;
        }

        /* Envelope Wrapper */
        .envelope-wrapper {
          position: relative;
          width: clamp(260px, 35vw, 476px);
          aspect-ratio: 1.55 / 1;
          margin-top: 34px;
          perspective: 1200px;
          animation: envelopeIntro 1100ms cubic-bezier(0.2, 0.8, 0.2, 1) both 500ms;
        }

        .envelope-glow {
          position: absolute;
          left: 50%;
          top: 50%;
          width: 120%;
          height: 120%;
          transform: translate(-50%, -50%);
          background: radial-gradient(circle, rgba(201,164,106,0.32), rgba(201,164,106,0.1) 38%, transparent 72%);
          filter: blur(22px);
          z-index: -1;
          animation: glowPulse 3.8s ease-in-out infinite;
        }

        /* Envelope CSS */
        .envelope {
          position: relative;
          width: 100%;
          height: 100%;
          border: 0;
          padding: 0;
          cursor: pointer;
          background: transparent;
          transform-style: preserve-3d;
          filter: 
            drop-shadow(0 4px 10px rgba(58,51,44,0.08))
            drop-shadow(0 16px 28px rgba(90,61,30,0.16))
            drop-shadow(0 36px 64px rgba(90,61,30,0.22));
          transition: transform 350ms ease, filter 350ms ease;
          display: block;
        }

        .envelope:hover {
          transform: translateY(-4px) scale(1.012);
          filter: 
            drop-shadow(0 4px 12px rgba(58,51,44,0.1))
            drop-shadow(0 20px 36px rgba(90,61,30,0.2))
            drop-shadow(0 42px 76px rgba(90,61,30,0.28));
        }

        .envelope:focus-visible {
          outline: 2px solid rgba(201,164,106,0.8);
          outline-offset: 8px;
        }

        .envelope-back {
          position: absolute;
          inset: 0;
          border-radius: 5px;
          background: linear-gradient(145deg, var(--red-main), var(--dark-red));
          box-shadow: 
            inset 0 1px 0 rgba(255,255,255,0.18),
            inset 0 -12px 28px rgba(0,0,0,0.12);
          overflow: hidden;
          z-index: 1;
        }

        .envelope-back::after {
          content: "";
          position: absolute;
          inset: 0;
          background: 
            radial-gradient(circle at 20% 15%, rgba(255,255,255,0.08), transparent 24%),
            linear-gradient(135deg, rgba(255,255,255,0.05), transparent 35%),
            repeating-linear-gradient(45deg, rgba(255,255,255,0.018) 0 1px, transparent 1px 4px);
          opacity: 0.7;
          pointer-events: none;
        }

        /* Flaps of the envelope */
        .envelope-flap {
          position: absolute;
          pointer-events: none;
        }

        .envelope-flap-top {
          position: absolute;
          left: 0;
          top: 0;
          width: 100%;
          height: 56%;
          background: linear-gradient(160deg, #B01E21, #7A1113);
          clip-path: polygon(0 0, 100% 0, 50% 100%);
          transform-origin: top center;
          z-index: 4;
          box-shadow: inset 0 -1px 0 rgba(0,0,0,0.22);
          transform: rotateX(0deg);
          transition: transform 900ms cubic-bezier(0.2, 0.8, 0.2, 1);
          backface-visibility: visible;
        }

        .envelope-flap-left {
          position: absolute;
          left: 0;
          bottom: 0;
          width: 52%;
          height: 100%;
          background: linear-gradient(35deg, #8F1618, #6F1012);
          clip-path: polygon(0 0, 100% 50%, 0 100%);
          z-index: 3;
        }

        .envelope-flap-right {
          position: absolute;
          right: 0;
          bottom: 0;
          width: 52%;
          height: 100%;
          background: linear-gradient(-35deg, #941719, #741113);
          clip-path: polygon(100% 0, 0 50%, 100% 100%);
          z-index: 3;
        }

        .envelope-flap-bottom {
          position: absolute;
          left: 0;
          bottom: 0;
          width: 100%;
          height: 58%;
          background: linear-gradient(0deg, #7A1113, #A3191B);
          clip-path: polygon(0 100%, 50% 0, 100% 100%);
          z-index: 5;
          box-shadow: inset 0 1px 0 rgba(255,255,255,0.08);
        }

        /* Envelope Card (Inside Ruột thiệp) */
        .envelope-card {
          position: absolute;
          left: 3%;
          top: 5%;
          width: 94%;
          height: 90%;
          background: #FFFFFF;
          border-radius: 4px;
          box-shadow: inset 0 0 0 1px rgba(201,164,106,0.3), 0 2px 8px rgba(0,0,0,0.15);
          z-index: 2;
          transform: translate3d(0, 0, 0);
          transform-origin: center center;
          backface-visibility: hidden;
          will-change: transform, opacity;
          transition: transform 1100ms cubic-bezier(0.18, 0.88, 0.25, 1), box-shadow 1100ms ease;
          box-sizing: border-box;
          padding: var(--card-padding-outer);
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden; /* Prevent text bleeding outside the card */
        }

        .card-inner {
          border: 1px solid rgba(201,164,106,0.25);
          border-radius: 3px;
          width: 100%;
          height: 100%;
          box-sizing: border-box;
          padding: var(--card-padding-inner);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          position: relative;
          background: #FCFAF7; /* Premium off-white card face */
        }

        /* Card typography */
        .card-monogram-gold {
          font-family: "Great Vibes", "Allura", cursive;
          font-size: var(--card-font-monogram);
          color: var(--champagne-gold);
          line-height: 1;
          margin-bottom: var(--card-margin-monogram);
        }

        .card-save-the-date {
          font-family: "Pinyon Script", "Great Vibes", cursive;
          font-size: var(--card-font-std);
          color: var(--name-gold);
          line-height: 1;
          margin-bottom: var(--card-margin-std);
        }

        .card-divider-line {
          width: var(--card-width-divider);
          height: 1px;
          background: linear-gradient(90deg, transparent, var(--champagne-gold), transparent);
          margin: var(--card-margin-divider);
        }

        .card-guest-prefix {
          font-family: "Montserrat", sans-serif;
          font-size: var(--card-font-prefix);
          font-weight: 500;
          letter-spacing: 2px;
          color: var(--label-text);
          margin: 0;
          text-transform: uppercase;
        }

        .card-guest-name {
          font-family: "Cormorant Garamond", serif;
          font-size: var(--card-font-guest);
          font-weight: 600;
          color: var(--text-main);
          margin: var(--card-margin-guest);
          text-align: center;
        }

        .card-couple-names {
          font-family: "Cormorant Garamond", serif;
          font-size: var(--card-font-couple);
          font-weight: 500;
          font-style: italic;
          color: var(--name-gold);
          margin: var(--card-margin-couple);
          text-align: center;
        }

        /* Wax Seal (Image asset) */
        .wax-seal {
          position: absolute;
          left: 50%;
          top: 50%;
          width: clamp(72px, 8.5vw, 105px);
          height: clamp(72px, 8.5vw, 105px);
          transform: translate3d(-50%, -50%, 15px) scale(1);
          z-index: 8;
          filter: drop-shadow(0 8px 16px rgba(58,51,44,0.35));
          animation: sealPulse 2.4s ease-in-out infinite;
          transition: opacity 380ms ease, transform 380ms ease;
          pointer-events: none;
        }

        /* Animations Keyframes */
        @keyframes fadeUpMonogram {
          0% { opacity: 0; transform: translateY(12px); }
          100% { opacity: 1; transform: translateY(0); }
        }

        @keyframes fadeUpLabel {
          0% { opacity: 0; transform: translateY(16px); }
          100% { opacity: 1; transform: translateY(0); }
        }

        @keyframes fadeInDivider {
          0% { opacity: 0; }
          100% { opacity: 1; }
        }

        @keyframes fadeUpName {
          0% { opacity: 0; transform: translateY(22px); }
          100% { opacity: 1; transform: translateY(0); }
        }

        @keyframes fadeInSubtitle {
          0% { opacity: 0; transform: translateY(12px); }
          100% { opacity: 1; transform: translateY(0); }
        }

        @keyframes envelopeIntro {
          0% { opacity: 0; transform: scale(0.96); }
          100% { opacity: 1; transform: scale(1); }
        }

        @keyframes glowPulse {
          0%, 100% { opacity: 0.65; transform: translate(-50%, -50%) scale(0.96); }
          50% { opacity: 1; transform: translate(-50%, -50%) scale(1.05); }
        }

        @keyframes sealPulse {
          0%, 100% { transform: translate3d(-50%, -50%, 15px) scale(1); }
          50% { transform: translate3d(-50%, -50%, 15px) scale(1.045); }
        }

        @keyframes openGlow {
          0% { transform: translate(-50%, -50%) scale(1); opacity: 1; }
          100% { transform: translate(-50%, -50%) scale(1.4); opacity: 0; filter: blur(35px); }
        }

        @keyframes petalFloat1 {
          0% { transform: translateY(0) translateX(0) rotate(0deg); opacity: 0; }
          10% { opacity: 0.8; }
          90% { opacity: 0.8; }
          100% { transform: translateY(105vh) translateX(-60px) rotate(320deg); opacity: 0; }
        }

        @keyframes petalFloat2 {
          0% { transform: translateY(0) translateX(0) rotate(0deg); opacity: 0; }
          15% { opacity: 0.75; }
          85% { opacity: 0.75; }
          100% { transform: translateY(105vh) translateX(60px) rotate(-280deg); opacity: 0; }
        }

        @keyframes petalFloat3 {
          0% { transform: translateY(0) translateX(0) rotate(0deg); opacity: 0; }
          20% { opacity: 0.65; }
          80% { opacity: 0.65; }
          100% { transform: translateY(105vh) translateX(-30px) rotate(180deg); opacity: 0; }
        }

        /* Opening Interaction Styles */
        .wedding-opening.is-opening .wax-seal {
          opacity: 0;
          transform: translate3d(-50%, -50%, 15px) scale(0.55);
          pointer-events: none;
        }

        .wedding-opening.is-opening .envelope-flap-top {
          transform: rotateX(180deg);
          z-index: 1;
        }

        .wedding-opening.is-opening .envelope {
          transform: translateY(-10px) scale(1.03);
          filter: 
            drop-shadow(0 4px 14px rgba(58,51,44,0.12))
            drop-shadow(0 24px 44px rgba(90,61,30,0.24))
            drop-shadow(0 48px 84px rgba(90,61,30,0.32));
        }

        .wedding-opening.is-opening .envelope-glow {
          animation: openGlow 900ms ease-out both;
        }

        /* Card Animation Phases */
        /* 1. Pull card out of envelope (Upward translation) */
        .wedding-opening.card-pulled .envelope-card {
          transform: translate3d(0, -72%, 12px);
          box-shadow: 0 10px 24px rgba(90,61,30,0.18);
        }

        /* 2. Slide card down and expand 10% so it feels lifted out of the envelope */
        .wedding-opening.card-front .envelope-card {
          transform: translate3d(0, -10%, 36px) scale(1.1);
          box-shadow: 0 25px 50px rgba(90,61,30,0.26);
          z-index: 10 !important;
          transition: transform 1150ms cubic-bezier(0.18, 0.88, 0.25, 1), box-shadow 1150ms ease;
        }

        /* Envelope shell fades out completely when card is in front */
        .wedding-opening.card-front .envelope-back,
        .wedding-opening.card-front .envelope-flap-top,
        .wedding-opening.card-front .envelope-flap-left,
        .wedding-opening.card-front .envelope-flap-right,
        .wedding-opening.card-front .envelope-flap-bottom {
          opacity: 0;
          transition: opacity 800ms ease;
        }

        /* Outer decorative texts and labels fade out completely to draw focus to the card */
        .opening-header,
        .opening-footer {
          transition: opacity 900ms ease, transform 900ms cubic-bezier(0.2, 0.8, 0.2, 1);
          will-change: opacity, transform;
        }

        .wedding-opening.card-front .opening-header {
          opacity: 0;
          transform: translateY(-24px);
          pointer-events: none;
        }

        .wedding-opening.card-front .opening-footer {
          opacity: 0;
          transform: translateY(24px);
          pointer-events: none;
        }

        /* 3. Card zooms in (scales up) and fades out to transition to the main page */
        .wedding-opening.card-zoomed .envelope-card {
          transform: translate3d(0, -10%, 180px) scale(2.65);
          opacity: 0;
          box-shadow: none;
          z-index: 10 !important;
          transition: transform 1300ms cubic-bezier(0.18, 0.88, 0.25, 1), opacity 1000ms ease 180ms;
        }

        .wedding-opening.is-hidden {
          opacity: 0;
          visibility: hidden;
          pointer-events: none;
        }

        /* Pause Hero Entrance Animations until opened */
        body:not(.invitation-active) .hero-content,
        body:not(.invitation-active) .hero-portrait {
          opacity: 0;
          animation: none !important;
        }

        /* Responsive Styles */
        @media (max-width: 768px) {
          .wedding-opening {
            padding: 32px 18px;
          }
          .couple-name {
            font-size: clamp(40px, 12vw, 58px);
            margin-bottom: 24px;
          }
          .invite-label {
            letter-spacing: 2.5px;
            font-size: 11px;
          }
          :root {
            --card-padding-outer: 6px;
            --card-padding-inner: 4px 6px;
            --card-font-monogram: 16px;
            --card-margin-monogram: 0px;
            --card-font-std: 18px;
            --card-margin-std: 2px;
            --card-margin-divider: 2px 0 4px;
            --card-width-divider: 35px;
            --card-font-prefix: 7px;
            --card-font-guest: 12px;
            --card-margin-guest: 1px 0 2px;
            --card-font-couple: 11px;
            --card-margin-couple: 2px 0;
            --card-font-date: 7px;
            --card-margin-date: 2px;
          }
          .envelope-wrapper {
            width: min(76vw, 306px);
          }
          .opening-subtitle {
            max-width: 300px;
            margin: 10px auto 0;
          }
          .floral-background {
            opacity: 0.65;
          }
          /* Reduce number of petals on mobile */
          .petal-5, .petal-6, .petal-7, .petal-8 {
            display: none !important;
          }
        }

        /* Short Viewports (Tuned to fit within 576px - 700px height screen sizes) */
        @media (max-height: 760px) {
          .wedding-opening {
            padding: 20px 16px;
          }
          .opening-content {
            transform: none;
          }
          .monogram {
            font-size: clamp(32px, 4.5vh, 48px);
            margin-bottom: 6px;
          }
          .invite-label {
            font-size: 11px;
            letter-spacing: 2.5px;
          }
          .gold-divider {
            margin: 8px auto 0;
          }
          .couple-name {
            font-size: clamp(36px, 6vh, 64px);
            margin-top: 10px;
            margin-bottom: 18px;
          }
          :root {
            --card-padding-outer: 8px;
            --card-padding-inner: 6px 8px;
            --card-font-monogram: clamp(16px, 2.8vh, 22px);
            --card-font-std: clamp(18px, 3.2vh, 26px);
            --card-font-guest: clamp(12px, 1.8vh, 16px);
            --card-font-couple: clamp(11px, 1.6vh, 14px);
          }
          .envelope-wrapper {
            width: clamp(220px, 30vh, 380px);
            margin-top: 18px;
          }
          .gold-divider.small {
            margin-top: 18px;
          }
          .opening-subtitle {
            font-size: clamp(15px, 2vh, 18px);
            margin-top: 18px;
            max-width: 380px;
          }
        }

        /* Extremely Short Viewports (Tuned to fit within < 580px height screen sizes) */
        @media (max-height: 580px) {
          .wedding-opening {
            padding: 12px 10px;
          }
          .monogram {
            font-size: clamp(26px, 4vh, 36px);
            margin-bottom: 4px;
          }
          .invite-label {
            font-size: 10px;
            letter-spacing: 2px;
          }
          .gold-divider {
            margin: 4px auto 0;
            height: 8px;
          }
          .couple-name {
            font-size: clamp(28px, 5vh, 48px);
            margin-top: 6px;
            margin-bottom: 10px;
          }
          :root {
            --card-padding-outer: 4px;
            --card-padding-inner: 3px 4px;
            --card-font-monogram: clamp(14px, 2.4vh, 18px);
            --card-margin-monogram: 0px;
            --card-font-std: clamp(15px, 2.6vh, 20px);
            --card-margin-std: 1px;
            --card-margin-divider: 1px 0 2px;
            --card-width-divider: 30px;
            --card-font-prefix: 6px;
            --card-font-guest: clamp(10px, 1.5vh, 12px);
            --card-margin-guest: 1px 0;
            --card-font-couple: clamp(9px, 1.4vh, 11px);
            --card-margin-couple: 1px 0;
            --card-font-date: 6px;
            --card-margin-date: 1px;
          }
          .envelope-wrapper {
            width: clamp(180px, 24vh, 260px);
            margin-top: 10px;
          }
          .gold-divider.small {
            margin-top: 10px;
            height: 8px;
          }
          .opening-subtitle {
            font-size: clamp(13px, 1.8vh, 15px);
            margin-top: 10px;
            max-width: 320px;
          }
        }

        /* Accessibility Focus and Prefers Reduced Motion */
        @media (prefers-reduced-motion: reduce) {
          .wax-seal {
            animation: none !important;
          }
          .envelope-glow {
            animation: none !important;
          }
          .opening-content, .envelope-wrapper {
            animation: none !important;
          }
          .envelope-flap-top {
            transition: transform 300ms ease !important;
          }
          .envelope {
            transition: transform 300ms ease !important;
          }
          .petal {
            animation: none !important;
            display: none !important;
          }
          .monogram, .invite-label, .gold-divider, .couple-name, .opening-subtitle {
            animation: none !important;
            opacity: 1 !important;
            transform: none !important;
          }
        }
      `}</style>

      {/* Opening Screen Markup */}
      <section 
        className={`wedding-opening ${isOpening ? 'is-opening' : ''} ${cardPulled ? 'card-pulled' : ''} ${cardFront ? 'card-front' : ''} ${cardZoomed ? 'card-zoomed' : ''} ${isFadingOut ? 'is-hidden' : ''}`}
        role="dialog"
        aria-modal="true"
        aria-label="Bìa thiệp cưới"
      >
        <div className="floral-background" aria-hidden="true"></div>
        
        <div className="petals-layer" aria-hidden="true">
          <div className="petal petal-1"></div>
          <div className="petal petal-2"></div>
          <div className="petal petal-3"></div>
          <div className="petal petal-4"></div>
          <div className="petal petal-5"></div>
          <div className="petal petal-6"></div>
          <div className="petal petal-7"></div>
          <div className="petal petal-8"></div>
        </div>

        <div className="opening-content">
          <div className="opening-header">
            <div className="monogram">HT</div>

            <p className="invite-label">{invitePrefix}</p>
            <div className="gold-divider" aria-hidden="true"></div>

            <h1 className="couple-name">
              Hoài Thanh <span className="ampersand">&amp;</span> Thanh Hiền
            </h1>
          </div>

          <div className="envelope-wrapper">
            <div className="envelope-glow" aria-hidden="true"></div>
            <div 
              className="envelope" 
              role="button" 
              tabIndex={isOpening ? -1 : 0}
              onClick={handleOpen}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handleOpen(); } }}
              style={{ pointerEvents: isOpening ? 'none' : 'auto' }}
              aria-label="Mở thiệp cưới"
            >
              <span className="envelope-back"></span>
              
              {/* Thiệp giấy bên trong phong bì */}
              <div className="envelope-card" id="envelopeCard">
                <div className="card-inner">
                  <div className="card-monogram-gold">HT</div>
                  <div className="card-save-the-date">Save the Date</div>
                  <div className="card-divider-line"></div>
                  <p className="card-guest-prefix">WEDDING INVITATION</p>
                  <h3 className="card-guest-name" id="envelopeGuestName">{guestName}</h3>
                  <p className="card-couple-names">Hoài Thanh &amp; Thanh Hiền</p>
                </div>
              </div>

              <span className="envelope-flap envelope-flap-top"></span>
              <span className="envelope-flap envelope-flap-left"></span>
              <span className="envelope-flap envelope-flap-right"></span>
              <span className="envelope-flap envelope-flap-bottom"></span>
              <img className="wax-seal" id="openInvitationBtn" src="/assets/decor/wax-seal.png" alt="Mở thiệp cưới" />
            </div>
          </div>

          <div className="opening-footer">
            <div className="gold-divider small" aria-hidden="true"></div>
            <p className="opening-subtitle">
              Nhấn để mở lời mời thân thương từ chúng tôi
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
