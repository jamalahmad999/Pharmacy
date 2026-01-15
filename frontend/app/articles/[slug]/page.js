"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Icons } from "@/components/Icons";

// Blog articles data (in a real app, this would come from an API/database)
const articles = {
  "advanced-aesthetic-treatments-dubai": {
    id: 1,
    title: "Transform Your Confidence with Advanced Aesthetic Treatments in Al Jaddaf, Dubai",
    excerpt: "At Smart Health Medical Center, we redefine beauty and wellness through state-of-the-art aesthetic treatments designed to rejuvenate your skin, enhance your appearance, and restore your natural glow.",
    image: "/blg (1).jpeg",
    date: "November 16, 2025",
    author: "Smart Health Team",
    readTime: "8 min read",
    category: "Aesthetics",
    content: `
      <div class="prose max-w-none">
        <p class="lead">At Smart Health Medical Center, located in the heart of Al Jaddaf, Dubai, we redefine beauty and wellness through state-of-the-art aesthetic treatments designed to rejuvenate your skin, enhance your appearance, and restore your natural glow. Our expert team combines medical precision with advanced cosmetic technology to deliver safe, effective, and personalized aesthetic care for men and women alike.</p>

        <h2>Why Choose Smart Health for Aesthetic Treatments in Dubai</h2>
        <p>When it comes to aesthetic treatments in Dubai, our clinic stands apart for its holistic and medically supervised approach. We offer a full spectrum of aesthetic and wellness services, from non-invasive facial rejuvenation to advanced laser therapies and skincare solutions. Our philosophy revolves around enhancing your natural beauty — not changing it. Every treatment plan is customized after an in-depth consultation with our specialists, ensuring that your results look flawlessly natural and long-lasting.</p>

        <h2>Comprehensive Range of Aesthetic Services</h2>
        <p>At Smart Health, our Aesthetic Department offers an array of innovative treatments that blend science, artistry, and precision. Each service is designed to target specific concerns while maintaining the health and vitality of your skin.</p>

        <h3>1. Facial Rejuvenation and Anti-Aging Treatments</h3>
        <p>Experience the power of non-surgical facial rejuvenation with our specialized anti-aging solutions. We use advanced injectables, dermal fillers, and collagen-boosting therapies to restore youthful contours and reduce wrinkles, fine lines, and sagging skin.</p>
        <p>Our facial treatments include:</p>
        <ul>
          <li>Botox and Fillers to smooth expression lines and restore facial volume</li>
          <li>PRP (Platelet-Rich Plasma) Therapy for natural collagen stimulation</li>
          <li>HydraFacial and Oxygen Facials for deep cleansing and hydration</li>
          <li>Mesotherapy to infuse vitamins and nutrients directly into your skin</li>
        </ul>
        <p>These rejuvenation procedures are quick, safe, and offer immediate visible results with minimal downtime.</p>

        <h3>2. Advanced Laser Treatments in Al Jaddaf</h3>
        <p>Our Laser Treatment Department provides cutting-edge technology to address a range of skin and cosmetic concerns. Whether you're looking for hair removal, skin tightening, or pigmentation correction, we offer the safest and most effective solutions.</p>
        <p>Our laser services include:</p>
        <ul>
          <li>Laser Hair Removal for smooth, hair-free skin</li>
          <li>Laser Skin Resurfacing to reduce scars, wrinkles, and pigmentation</li>
          <li>Laser Vein and Spot Removal for a clear, even complexion</li>
          <li>Laser Tattoo Removal using advanced non-invasive methods</li>
        </ul>
        <p>With the latest FDA-approved systems, our laser experts ensure precise, comfortable treatments with remarkable results.</p>

        <h3>3. Skin Care and Wellness Solutions</h3>
        <p>Healthy skin begins with a healthy body. Our Wellness and Skincare Programs are designed to enhance both your appearance and overall vitality. We offer detox programs, IV vitamin drips, and nutritional consultations that help your skin glow from the inside out.</p>
        <p>Our wellness approach includes:</p>
        <ul>
          <li>Skin Brightening Treatments for radiant, even-toned skin</li>
          <li>Microneedling with PRP to improve texture and elasticity</li>
          <li>Chemical Peels for exfoliation and cellular renewal</li>
          <li>Customized Skincare Plans tailored to your unique skin type and concerns</li>
        </ul>
        <p>Each treatment is performed by licensed dermatologists and aesthetic practitioners who prioritize safety and results.</p>

        <h3>4. Physiotherapy and Holistic Health</h3>
        <p>Beauty thrives when your body feels its best. Our Physiotherapy Department supports your aesthetic goals by promoting overall mobility, posture, and muscle tone. From injury rehabilitation to pain management and muscle recovery, our physiotherapists employ advanced therapeutic techniques to improve your well-being.</p>

        <h3>5. Dental Aesthetics and Smile Makeovers</h3>
        <p>At Smart Health, aesthetic care goes beyond skincare. Our Dental Department specializes in cosmetic dentistry, including teeth whitening, veneers, and smile design. A confident smile is one of your most powerful aesthetic assets, and our dental experts ensure that yours shines brightly and naturally.</p>

        <h3>6. Family and General Medicine Department</h3>
        <p>As a comprehensive medical center in Al Jaddaf, we integrate aesthetic and medical care under one roof. Our General and Family Medicine Department ensures your treatments are medically supervised and safe. Whether it's preventive health screenings or general consultations, our physicians are dedicated to your overall health and peace of mind.</p>

        <h3>7. Pediatrics and Preventive Health Screenings</h3>
        <p>We take pride in being a family-friendly clinic offering specialized pediatric care and preventive health screenings. Our pediatric specialists focus on children's growth, wellness, and immunizations, while our preventive screenings help adults detect potential health risks early — supporting a healthy lifestyle from childhood to adulthood.</p>

        <h2>Our Commitment to Quality and Care</h2>
        <p>Every treatment at Smart Health Medical Center is performed in a sterile, modern, and welcoming environment using FDA-approved technologies. We believe in transparency, patient education, and ethical medical practices. Our multilingual team of specialists ensures a comfortable and trusted experience for both local and international patients.</p>
        <p>We are conveniently located in Al Jaddaf, Dubai, with operating hours from Monday to Sunday, 8 am to 10 pm, allowing flexibility for even the busiest schedules. You can reach us at Info@smarthealth.ae or call +971 50 110 3405 to book your consultation.</p>

        <h2>Why Dubai Chooses Smart Health for Aesthetic Treatments</h2>
        <p>Dubai's residents seek nothing less than excellence — and Smart Health delivers it with precision, expertise, and care. Whether you're preparing for a special occasion or simply wish to enhance your everyday appearance, our aesthetic experts will guide you through every step with professional advice and proven results.</p>
        <p>Our clinic attracts clients who value quality, privacy, and exceptional results. With a comprehensive range of services spanning aesthetics, wellness, physiotherapy, dentistry, and family medicine, we are your trusted partner in health and beauty.</p>

        <h2>Visit Smart Health Medical Center Today</h2>
        <p>Your journey to confidence, radiance, and wellness begins here. At Smart Health Medical Center, we combine art, science, and care to help you look and feel your best. Experience world-class aesthetic treatments in Al Jaddaf, Dubai, and let our experts bring out your true beauty — naturally and safely.</p>
        <p><strong>Smart Health Medical Center – Aesthetic Excellence in Al Jaddaf, Dubai</strong></p>
        <p>📍 Location: Al Jaddaf, Dubai, United Arab Emirates</p>
        <p>📅 Timings: Mon - Sun | 8 am – 10 pm</p>
        <p>📧 Email: Info@smarthealth.ae</p>
        <p>📞 Call: +971 50 110 3405</p>
      </div>
    `
  },
  "laser-treatments-guide-dubai": {
    id: 2,
    title: "The Ultimate Guide to Laser Treatments: Benefits, Types, and Results",
    excerpt: "Welcome to Smart Health Medical Center, your trusted destination for advanced laser treatments in Al Jaddaf, Dubai. Our clinic offers cutting-edge technology for flawless, radiant skin.",
    image: "/images/laser-treatments.jpg",
    date: "November 16, 2025",
    author: "Smart Health Team",
    readTime: "10 min read",
    category: "Laser Treatments",
    content: `
      <div class="prose max-w-none">
        <p class="lead">Welcome to Smart Health Medical Center, your trusted destination for advanced laser treatments in Al Jaddaf, Dubai. Our clinic offers a combination of cutting-edge technology, medical precision, and aesthetic expertise to help you achieve flawless, radiant, and youthful skin. Whether you want to remove unwanted hair, improve skin tone, or rejuvenate your complexion, our team of certified laser specialists delivers safe, effective, and lasting results tailored to your needs.</p>

        <h2>Why Choose Smart Health for Laser Treatments in Dubai</h2>
        <p>When it comes to laser treatments in Dubai, precision and expertise make all the difference. At Smart Health, we combine the most advanced laser systems with the highest medical standards. Our dermatologists and laser specialists customize each procedure according to your skin type, concerns, and goals — ensuring optimal results with minimal discomfort or downtime.</p>
        <p>We are known for:</p>
        <ul>
          <li>FDA-approved laser technology for safe, medical-grade results</li>
          <li>Experienced dermatologists and aesthetic practitioners</li>
          <li>Personalized treatment plans based on your skin tone and texture</li>
          <li>Comfortable, modern, and hygienic environment</li>
          <li>Proven results with long-term skin health benefits</li>
        </ul>

        <h2>Comprehensive Range of Laser Treatments</h2>
        <p>At Smart Health, we offer a wide variety of laser skin and hair treatments designed to target multiple concerns. Our focus is on achieving natural, smooth, and rejuvenated skin without surgery.</p>

        <h3>1. Laser Hair Removal</h3>
        <p>Say goodbye to razors, waxing, and threading with permanent laser hair removal. Our advanced laser technology safely and effectively removes unwanted hair from all areas of the body — including the face, underarms, arms, legs, bikini area, and back.</p>
        <p>Benefits include:</p>
        <ul>
          <li>Smooth, hair-free skin with no irritation</li>
          <li>Suitable for all skin tones and types</li>
          <li>Long-term reduction of hair growth</li>
          <li>Quick, painless sessions with visible results</li>
        </ul>
        <p>Our dermatologists tailor the laser settings to your specific hair and skin type to ensure safe and efficient outcomes.</p>

        <h3>2. Laser Skin Rejuvenation</h3>
        <p>Rediscover youthful, glowing skin with laser skin rejuvenation, a non-invasive procedure that stimulates collagen production, minimizes fine lines, and reduces visible signs of aging.</p>
        <p>Our laser rejuvenation services help with:</p>
        <ul>
          <li>Fine lines and wrinkles</li>
          <li>Sun damage and pigmentation</li>
          <li>Enlarged pores</li>
          <li>Uneven texture and dull skin tone</li>
        </ul>
        <p>By targeting deep layers of the skin, this treatment promotes natural renewal — leaving your complexion firmer, smoother, and visibly more radiant.</p>

        <h3>3. Laser Pigmentation and Dark Spot Removal</h3>
        <p>Uneven pigmentation, sun spots, and melasma can dull your appearance. Our laser pigmentation removal treatments precisely target and break down excess melanin, revealing a clear, even-toned complexion.</p>
        <p>This safe, precise procedure effectively treats:</p>
        <ul>
          <li>Freckles and age spots</li>
          <li>Sun damage</li>
          <li>Melasma and post-inflammatory hyperpigmentation</li>
          <li>Acne scars and uneven skin tone</li>
        </ul>
        <p>After a few sessions, your skin appears brighter, more uniform, and rejuvenated.</p>

        <h3>4. Laser Tattoo Removal</h3>
        <p>Tattoos can fade away safely and effectively with our advanced laser tattoo removal services. Using cutting-edge Q-switched and Pico laser technology, we break down ink particles without damaging surrounding skin.</p>
        <p>Key benefits include:</p>
        <ul>
          <li>Effective on all tattoo colors and sizes</li>
          <li>Minimal discomfort and downtime</li>
          <li>Safe for all skin types</li>
          <li>Gradual fading after each session</li>
        </ul>
        <p>Our laser specialists ensure personalized care for optimal tattoo removal outcomes.</p>

        <h3>5. Laser Acne and Scar Reduction</h3>
        <p>Acne scars can be frustrating, but laser scar reduction offers a proven, non-surgical solution. Our fractional laser technology smooths out uneven texture, reduces redness, and restores confidence.</p>
        <p>Benefits include:</p>
        <ul>
          <li>Reduction of acne scars and pitted marks</li>
          <li>Smoother, more even skin texture</li>
          <li>Enhanced collagen production</li>
          <li>Minimal recovery time</li>
        </ul>
        <p>This treatment is ideal for anyone struggling with post-acne damage or facial scarring.</p>

        <h3>6. Laser Vein and Vascular Lesion Treatment</h3>
        <p>Our laser vein treatment safely removes small facial veins, spider veins, and vascular lesions with precision. The laser targets blood vessels without affecting the surrounding skin, resulting in a clear, even complexion.</p>
        <p>It's a quick, virtually painless procedure with no downtime — perfect for those looking to restore confidence in their appearance.</p>

        <h2>Personalized Laser Care for Every Skin Type</h2>
        <p>At Smart Health Medical Center, we understand that every skin type is unique. That's why our experts perform detailed assessments before recommending any laser procedure. We tailor laser wavelengths, intensity, and treatment duration according to your individual needs — ensuring the best possible outcomes.</p>
        <p>Our clinic adheres to strict safety protocols, and every treatment is performed under medical supervision for complete peace of mind.</p>

        <h2>Your Laser Journey with Smart Health</h2>
        <p><strong>Consultation:</strong> We begin with a detailed consultation to evaluate your goals, skin type, and medical history.</p>
        <p><strong>Customized Treatment Plan:</strong> Our specialists design a personalized laser protocol suited to your unique skin concerns.</p>
        <p><strong>Treatment Session:</strong> Using the latest technology, we deliver precise laser applications with minimal discomfort.</p>
        <p><strong>Aftercare & Maintenance:</strong> Our experts provide post-treatment care and long-term skin maintenance tips for lasting results.</p>

        <h2>Other Departments at Smart Health Medical Center</h2>
        <p>Beyond aesthetic and laser care, Smart Health offers a wide range of healthcare and wellness services, including:</p>
        <ul>
          <li>Physiotherapy for pain management and rehabilitation</li>
          <li>Dental Department for smile makeovers and oral care</li>
          <li>Pediatrics and Family Medicine for comprehensive healthcare</li>
          <li>Preventive Health Screenings for early disease detection</li>
          <li>Nursing & Laboratory Services for convenience and accuracy</li>
        </ul>
        <p>We take pride in being a complete health and wellness destination where beauty and medical expertise meet.</p>

        <h2>Visit Smart Health in Al Jaddaf, Dubai</h2>
        <p>Located conveniently in Al Jaddaf, Dubai, United Arab Emirates, Smart Health Medical Center welcomes clients seven days a week from 8 am to 10 pm. Our professional and multilingual staff ensure your visit is comfortable and rewarding.</p>
        <p>📧 Email: Info@smarthealth.ae</p>
        <p>📞 Phone: +971 50 110 3405</p>
        <p>Whether you're looking for laser hair removal, skin rejuvenation, or pigmentation correction, Smart Health provides the most advanced, safe, and effective laser treatments in Dubai.</p>

        <h2>Conclusion</h2>
        <p>At Smart Health Medical Center, we believe that radiant skin reflects confidence and self-care. Our laser treatments in Al Jaddaf, Dubai offer medical-grade precision and visible results that transform your skin and elevate your beauty — all under expert supervision.</p>
        <p>Trust our specialists to guide you through every step of your aesthetic journey with personalized care, proven technology, and exceptional results.</p>
      </div>
    `
  },
  "advanced-physiotherapy-techniques-dubai": {
    id: 3,
    title: "Heal Naturally with Our Advanced Physiotherapy Techniques",
    excerpt: "At Smart Healthcare Polyclinic, we specialize in advanced physiotherapy treatments in Al Jaddaf, Dubai, designed to help you recover, rebuild, and regain your quality of life.",
    image: "/blg (2).jpeg",
    date: "November 16, 2025",
    author: "Smart Health Team",
    readTime: "9 min read",
    category: "Physiotherapy",
    content: `
      <div class="prose max-w-none">
        <p class="lead">At Smart Healthcare Polyclinic, we specialize in advanced physiotherapy treatments in Al Jaddaf, Dubai, designed to help you recover, rebuild, and regain your quality of life. Whether you're dealing with chronic pain, a sports injury, post-surgical recovery, or mobility issues, our team of licensed physiotherapists provides personalized care tailored to your unique needs. We believe in a holistic approach to physiotherapy — combining clinical expertise, cutting-edge equipment, and evidence-based techniques to help you move better, feel stronger, and live pain-free.</p>

        <h2>Why Choose Smart Health for Physiotherapy in Dubai</h2>
        <p>When it comes to physiotherapy in Dubai, Smart Healthcare Polyclinic stands out for its patient-centered care, state-of-the-art technology, and team of experienced physiotherapists. We focus not only on treating pain but also on identifying and correcting the underlying causes of physical discomfort and dysfunction.</p>
        <p>Our physiotherapy department is equipped with advanced rehabilitation tools, electrotherapy machines, and modern exercise systems designed to accelerate recovery and prevent re-injury.</p>
        <p>At Smart Health, we promise:</p>
        <ul>
          <li>Comprehensive physiotherapy assessments and treatment plans</li>
          <li>Expert physiotherapists trained in manual therapy and rehabilitation</li>
          <li>Customized recovery programs for all age groups</li>
          <li>Comfortable and modern rehabilitation rooms</li>
          <li>Proven results in pain relief, mobility improvement, and postural correction</li>
        </ul>

        <h2>Our Comprehensive Physiotherapy Services</h2>
        <p>We offer a wide range of physiotherapy treatments in Al Jaddaf tailored to address diverse conditions — from sports injuries to chronic musculoskeletal disorders.</p>

        <h3>1. Musculoskeletal Physiotherapy</h3>
        <p>Musculoskeletal physiotherapy focuses on relieving pain, restoring function, and improving flexibility in muscles, joints, and ligaments. Whether you're suffering from back pain, neck stiffness, or shoulder injuries, our expert physiotherapists use manual therapy and targeted exercises to help you recover naturally.</p>
        <p>Common conditions treated include:</p>
        <ul>
          <li>Back and neck pain</li>
          <li>Shoulder impingement and frozen shoulder</li>
          <li>Muscle strains and ligament sprains</li>
          <li>Joint stiffness and inflammation</li>
          <li>Postural misalignments</li>
        </ul>
        <p>Our goal is to eliminate pain, restore movement, and prevent recurrence through customized exercise programs.</p>

        <h3>2. Sports Physiotherapy</h3>
        <p>For athletes and active individuals, sports physiotherapy plays a vital role in performance enhancement and injury prevention. At Smart Health, we provide specialized treatment for acute and chronic sports injuries using modern rehabilitation techniques.</p>
        <p>Our sports physiotherapy services include:</p>
        <ul>
          <li>Sports injury diagnosis and treatment</li>
          <li>Post-injury rehabilitation and conditioning</li>
          <li>Strength and endurance training</li>
          <li>Injury prevention programs</li>
          <li>Biomechanical and posture assessments</li>
        </ul>
        <p>Our experts work closely with athletes to ensure a safe and efficient return to peak performance.</p>

        <h3>3. Post-Surgical Rehabilitation</h3>
        <p>After surgery, physiotherapy is essential for proper recovery and mobility restoration. Our post-surgical physiotherapy programs are designed to enhance healing, improve joint movement, and rebuild muscle strength safely.</p>
        <p>We assist patients recovering from:</p>
        <ul>
          <li>Orthopedic surgeries (knee, hip, shoulder, etc.)</li>
          <li>Spinal and neurological surgeries</li>
          <li>Cardiac and pulmonary procedures</li>
          <li>Ligament reconstruction and joint replacement</li>
        </ul>
        <p>Our specialists create personalized recovery timelines, ensuring that each session supports gradual and complete healing.</p>

        <h3>4. Neurological Physiotherapy</h3>
        <p>Neurological physiotherapy helps individuals with conditions affecting the brain, spinal cord, and nerves regain balance, coordination, and functional independence.</p>
        <p>We offer therapy for:</p>
        <ul>
          <li>Stroke recovery</li>
          <li>Parkinson's disease</li>
          <li>Multiple sclerosis</li>
          <li>Spinal cord injuries</li>
          <li>Neuropathy and balance disorders</li>
        </ul>
        <p>Our neurologically trained physiotherapists use targeted exercises, balance retraining, and coordination drills to restore mobility and improve quality of life.</p>

        <h3>5. Pediatric Physiotherapy</h3>
        <p>Children with developmental delays, injuries, or congenital conditions benefit greatly from pediatric physiotherapy. Our child-friendly specialists focus on improving motor skills, balance, coordination, and muscle tone.</p>
        <p>Common pediatric cases treated:</p>
        <ul>
          <li>Delayed milestones</li>
          <li>Cerebral palsy</li>
          <li>Post-injury rehabilitation</li>
          <li>Congenital deformities</li>
        </ul>
        <p>Each child's therapy plan is customized to support healthy physical development in a nurturing, supportive environment.</p>

        <h3>6. Geriatric Physiotherapy</h3>
        <p>As we age, mobility and joint flexibility can decline. Our geriatric physiotherapy services aim to improve strength, balance, and endurance while reducing the risk of falls and joint stiffness.</p>
        <p>We assist elderly patients with:</p>
        <ul>
          <li>Osteoarthritis</li>
          <li>Joint pain and stiffness</li>
          <li>Post-fracture rehabilitation</li>
          <li>Fall prevention and balance training</li>
          <li>Mobility assistance and muscle strengthening</li>
        </ul>
        <p>Our compassionate therapists ensure comfort, safety, and dignity throughout every session.</p>

        <h3>7. Women's Health Physiotherapy</h3>
        <p>Our specialized women's physiotherapy services address conditions related to pregnancy, postnatal recovery, and pelvic health.</p>
        <p>Treatments include:</p>
        <ul>
          <li>Prenatal and postnatal exercises</li>
          <li>Pelvic floor rehabilitation</li>
          <li>Lower back pain and posture correction</li>
          <li>Hormonal and circulation-related discomfort management</li>
        </ul>
        <p>These gentle yet effective programs help women regain strength and confidence at every stage of life.</p>

        <h2>Benefits of Physiotherapy at Smart Healthcare Polyclinic</h2>
        <p>Choosing Smart Health means choosing results-driven care that restores your independence and confidence. Some of the key benefits of our physiotherapy services include:</p>
        <ul>
          <li>Pain relief without medication or surgery</li>
          <li>Improved flexibility and movement</li>
          <li>Faster post-injury or post-surgical recovery</li>
          <li>Enhanced athletic performance</li>
          <li>Better posture and core stability</li>
          <li>Long-term prevention of future injuries</li>
        </ul>
        <p>Each session is carefully planned to meet your recovery goals while maintaining your comfort and safety.</p>

        <h2>Our Integrated Approach to Wellness</h2>
        <p>At Smart Healthcare Polyclinic, we believe that physiotherapy works best when integrated with other health and wellness services. That's why we offer a complete range of treatments under one roof, including:</p>
        <ul>
          <li>Aesthetic Treatments for rejuvenation and skincare</li>
          <li>Laser Treatments for hair and skin solutions</li>
          <li>Dental Care for oral health and aesthetics</li>
          <li>Family Medicine and Pediatrics for holistic wellness</li>
          <li>Preventive Health Screenings for early disease detection and disease prevention</li>
        </ul>
        <p>This integrated approach ensures every patient receives comprehensive care for both body and mind.</p>

        <h2>Visit Smart Healthcare Polyclinic – Al Jaddaf, Dubai</h2>
        <p>Located in Al Jaddaf, Dubai, United Arab Emirates, Smart Healthcare Polyclinic is your trusted destination for physiotherapy and rehabilitation. Our modern facility, experienced therapists, and evidence-based methods ensure every patient receives the highest standard of care.</p>
        <p>📅 Timings: Mon – Sun | 8 am – 10 pm</p>
        <p>📧 Email: Info@smarthealth.ae</p>
        <p>📞 Phone: +971 50 110 3405</p>
        <p>Whether you're recovering from an injury, managing chronic pain, or seeking to improve your physical performance, our physiotherapy experts in Dubai are here to guide you every step of the way.</p>

        <h2>Conclusion</h2>
        <p>At Smart Healthcare Polyclinic, we go beyond traditional physiotherapy — we empower you to live pain-free, move freely, and enjoy a healthier lifestyle. Our evidence-based treatments and compassionate care make us one of the leading centers for physiotherapy in Al Jaddaf, Dubai.</p>
        <p>Experience the difference of personalized rehabilitation and regain your strength, balance, and vitality with Smart Health today.</p>
      </div>
    `
  },
  "complete-dental-treatments-dubai": {
    id: 4,
    title: "Complete Dental Treatments for a Perfect Smile",
    excerpt: "A beautiful smile is more than just appearance — it reflects confidence, health, and well-being. At Smart Healthcare Polyclinic, we offer advanced dental treatments for a bright, healthy smile.",
    image: "/blg (3).jpeg",
    date: "November 16, 2025",
    author: "Smart Health Team",
    readTime: "11 min read",
    category: "Dental Care",
    content: `
      <div class="prose max-w-none">
        <p class="lead">A beautiful smile is more than just appearance — it reflects confidence, health, and well-being. At Smart Healthcare Polyclinic in Al Jaddaf, Dubai, we offer a full spectrum of advanced dental treatments to help you achieve a bright, healthy, and confident smile. Whether you need a simple cleaning, cosmetic enhancement, or complete dental restoration, our team of expert dentists ensures your comfort, safety, and satisfaction at every step. Our clinic combines state-of-the-art dental technology, experienced dental specialists, and personalized care to deliver outstanding results for patients of all ages.</p>

        <h2>Why Choose Smart Health for Dental Treatments in Dubai</h2>
        <p>When it comes to dental care in Dubai, Smart Healthcare Polyclinic stands out for excellence in both general dentistry and cosmetic dental services. Our goal is to provide comprehensive oral care that enhances your health and appearance while ensuring a pain-free experience.</p>
        <p>We focus on preventive care, aesthetic enhancements, and restorative treatments — all performed in a calm, hygienic, and modern environment.</p>
        <p>At Smart Health, you can expect:</p>
        <ul>
          <li>Experienced dentists and specialists in multiple dental fields</li>
          <li>Modern dental equipment for precision and comfort</li>
          <li>Comprehensive oral health assessments</li>
          <li>Painless and safe treatment methods</li>
          <li>Personalized dental plans for long-term oral wellness</li>
        </ul>

        <h2>Our Comprehensive Dental Services</h2>
        <p>Our Dental Department in Al Jaddaf offers a complete range of treatments for every need — from preventive care to cosmetic dentistry and surgical procedures.</p>

        <h3>1. General Dentistry</h3>
        <p>Maintaining good oral health begins with regular dental check-ups and cleanings. Our general dentistry services focus on early detection, prevention, and treatment of common dental issues before they become serious.</p>
        <p>Our general dental services include:</p>
        <ul>
          <li>Dental cleaning and polishing</li>
          <li>Tooth fillings and restorations</li>
          <li>Gum disease treatment</li>
          <li>Tooth extractions</li>
          <li>Oral hygiene education</li>
        </ul>
        <p>Routine dental visits help protect your teeth from decay and ensure a lifetime of healthy smiles.</p>

        <h3>2. Cosmetic Dentistry</h3>
        <p>Your smile is your signature. Our cosmetic dental treatments are designed to enhance its beauty and boost your confidence. Using advanced techniques, we reshape, restore, and brighten your teeth for a naturally stunning result.</p>
        <p>Our cosmetic treatments include:</p>
        <ul>
          <li>Teeth Whitening – Brighten your smile safely and effectively</li>
          <li>Porcelain Veneers – Reshape and enhance your teeth for a perfect smile</li>
          <li>Smile Makeovers – Customized plans combining multiple treatments</li>
          <li>Tooth Bonding – Repair chips, gaps, and imperfections</li>
        </ul>
        <p>Each cosmetic procedure is tailored to suit your facial structure and aesthetic goals, ensuring a balanced and radiant smile.</p>

        <h3>3. Orthodontic Treatments</h3>
        <p>Crooked or misaligned teeth not only affect your appearance but also your oral health. Our orthodontic treatments help align teeth perfectly using modern techniques.</p>
        <p>We offer:</p>
        <ul>
          <li>Traditional Braces for precise alignment</li>
          <li>Invisalign (Clear Aligners) for discreet straightening</li>
          <li>Retainers and Space Maintainers for post-treatment support</li>
        </ul>
        <p>Our orthodontists ensure a comfortable experience with predictable, long-lasting results.</p>

        <h3>4. Restorative Dentistry</h3>
        <p>If you're dealing with damaged or missing teeth, our restorative dental treatments help rebuild your smile's function and beauty.</p>
        <p>We provide:</p>
        <ul>
          <li>Dental Crowns and Bridges for strength and stability</li>
          <li>Dental Implants to replace missing teeth permanently</li>
          <li>Dentures for full or partial tooth replacement</li>
          <li>Inlays and Onlays for precise restoration of damaged teeth</li>
        </ul>
        <p>Each restoration is customized to match your natural teeth in color, shape, and size — ensuring a seamless, natural look.</p>

        <h3>5. Pediatric Dentistry</h3>
        <p>Children deserve specialized care and attention when it comes to oral health. Our pediatric dentists make dental visits fun, friendly, and stress-free for young patients.</p>
        <p>Our children's dental services include:</p>
        <ul>
          <li>Fluoride treatments</li>
          <li>Dental sealants</li>
          <li>Tooth extractions</li>
          <li>Cavity prevention and fillings</li>
          <li>Growth and alignment monitoring</li>
        </ul>
        <p>We teach children good oral hygiene habits from an early age, helping them maintain healthy smiles for life.</p>

        <h3>6. Root Canal Treatment (Endodontics)</h3>
        <p>When tooth decay reaches the pulp, root canal therapy can save your tooth and relieve pain. Our skilled endodontists perform this procedure with precision and care, using modern anesthesia and digital imaging for accuracy.</p>
        <p>Benefits include:</p>
        <ul>
          <li>Pain-free treatment</li>
          <li>Preservation of your natural tooth</li>
          <li>Long-term protection from infection</li>
        </ul>
        <p>With state-of-the-art equipment, root canal procedures at Smart Health are comfortable, efficient, and successful.</p>

        <h3>7. Periodontal (Gum) Treatment</h3>
        <p>Healthy gums are essential for a healthy mouth. Our periodontal treatments address gum infections, bleeding, and inflammation to prevent tooth loss and other complications.</p>
        <p>We provide:</p>
        <ul>
          <li>Deep cleaning (scaling and root planing)</li>
          <li>Laser gum therapy</li>
          <li>Gum reshaping for aesthetics and hygiene</li>
          <li>Ongoing maintenance programs</li>
        </ul>
        <p>Our gum specialists ensure your smile stays strong and your gums remain healthy for years to come.</p>

        <h3>8. Dental Emergency Services</h3>
        <p>Dental pain or trauma can strike anytime. At Smart Health, our emergency dental care is available to provide quick relief and immediate treatment.</p>
        <p>Whether it's a broken tooth, severe pain, or bleeding gums, our dentists are equipped to handle all dental emergencies efficiently.</p>

        <h2>Benefits of Dental Treatments at Smart Healthcare Polyclinic</h2>
        <p>Choosing Smart Health means choosing a team dedicated to your dental well-being. Here's why patients across Dubai trust us:</p>
        <ul>
          <li>Pain-free, modern techniques for maximum comfort</li>
          <li>Advanced imaging and diagnostics for precise care</li>
          <li>Comprehensive oral health monitoring</li>
          <li>Aesthetic and functional restoration for natural results</li>
          <li>Multilingual staff for an inclusive and comfortable experience</li>
        </ul>
        <p>We focus on long-term oral health rather than short-term fixes — ensuring your smile remains bright and healthy.</p>

        <h2>Integrative Healthcare Under One Roof</h2>
        <p>At Smart Healthcare Polyclinic, your dental care is part of a larger vision of overall wellness. Alongside our Dental Department, we offer:</p>
        <ul>
          <li>Aesthetic Treatments for skin and facial rejuvenation</li>
          <li>Laser Treatments for hair and skin solutions</li>
          <li>Physiotherapy for recovery and mobility</li>
          <li>Pediatrics and Family Medicine for total health care</li>
          <li>Preventive Health Screenings to monitor your wellness</li>
        </ul>
        <p>This integrated approach allows us to treat you holistically — focusing on both health and beauty.</p>

        <h2>Visit Smart Healthcare Polyclinic – Al Jaddaf, Dubai</h2>
        <p>Your perfect smile begins here. Visit Smart Healthcare Polyclinic in Al Jaddaf, Dubai, United Arab Emirates, for world-class dental treatments tailored to your needs.</p>
        <p>📅 Timings: Mon – Sun | 8 am – 10 pm</p>
        <p>📧 Email: Info@smarthealth.ae</p>
        <p>📞 Phone: +971 50 110 3405</p>
        <p>Our team of dedicated dentists and specialists is ready to help you achieve the smile you've always dreamed of — naturally, safely, and beautifully.</p>

        <h2>Conclusion</h2>
        <p>At Smart Healthcare Polyclinic, we believe every smile tells a story — and we're here to make yours unforgettable. Our dental treatments in Al Jaddaf, Dubai combine art, science, and care to ensure lasting oral health and confidence. Whether it's routine check-ups or complete smile makeovers, you can trust us to deliver excellence in every detail.</p>
        <p>Visit Smart Health today and experience the best dental care in Dubai, where your comfort and smile are our top priorities.</p>
      </div>
    `
  }
};

export default function ArticlePage() {
  const params = useParams();
  const router = useRouter();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (params.slug) {
      const foundArticle = articles[params.slug];
      if (foundArticle) {
        setArticle(foundArticle);
        // Scroll to top when article loads
        window.scrollTo(0, 0);
      } else {
        router.push('/');
      }
      setLoading(false);
    }
  }, [params.slug, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!article) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Article Content with Image on Right */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <article className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Header Section */}
          <div className="bg-[#6EC6FF] text-white p-6 md:p-8">
            {/* Breadcrumb */}
            <nav className="flex items-center space-x-2 text-sm text-blue-100 mb-4">
              <Link href="/" className="hover:text-white transition-colors">Home</Link>
              <span>/</span>
              <span>Articles</span>
            </nav>

            {/* Category Badge */}
            <div className="mb-4">
              <span className="inline-block px-3 py-1 bg-blue-500 text-white rounded-full text-sm font-medium">
                {article.category}
              </span>
            </div>

            {/* Title */}
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4 leading-tight">
              {article.title}
            </h1>

            {/* Meta Info */}
            <div className="flex flex-wrap items-center gap-4 text-sm text-blue-100">
              <div className="flex items-center gap-2">
                <Icons.User className="w-4 h-4" />
                <span>{article.author}</span>
              </div>
              <div className="flex items-center gap-2">
                <Icons.Calendar className="w-4 h-4" />
                <span>{article.date}</span>
              </div>
              <div className="flex items-center gap-2">
                <Icons.Clock className="w-4 h-4" />
                <span>{article.readTime}</span>
              </div>
            </div>
          </div>

          {/* Content and Image Section */}
          <div className="flex flex-col lg:flex-row">
            {/* Article Content - Full Width on Mobile, 2/3 on Desktop */}
            <div className="w-full lg:w-2/3 p-6 md:p-8">
              {/* Article Content */}
              <div 
                className="article-content prose prose-lg max-w-none prose-headings:text-gray-900 prose-p:text-gray-600 prose-p:leading-relaxed prose-li:text-gray-600 prose-strong:text-gray-900 prose-blockquote:border-blue-500 prose-blockquote:text-gray-600"
                dangerouslySetInnerHTML={{ __html: article.content }}
              />
            </div>

            {/* Featured Image - Hidden on Mobile, 1/3 on Desktop */}
            <div className="hidden lg:block w-1/3 p-6">
              <img
                src={article.image}
                alt={article.title}
                className="w-full h-auto object-cover rounded-lg shadow-lg"
              />
            </div>
          </div>

          {/* Share Section */}
          <div className="mt-10 pt-6 border-t border-gray-200">
            <h3 className="text-lg font-semibold mb-4">Share this article</h3>
            <div className="flex gap-3">
              <button className="p-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors">
                <Icons.Share className="w-5 h-5" />
              </button>
              <button className="p-3 bg-green-600 text-white rounded-full hover:bg-green-700 transition-colors">
                <Icons.Share className="w-5 h-5" />
              </button>
              <button className="p-3 bg-blue-400 text-white rounded-full hover:bg-blue-500 transition-colors">
                <Icons.Share className="w-5 h-5" />
              </button>
            </div>
          </div>
        </article>
      </div>
    </div>
  );
}
