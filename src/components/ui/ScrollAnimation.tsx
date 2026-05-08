"use client";

import { motion, useInView, UseInViewOptions, Variants } from "framer-motion";
import { useRef, ReactNode } from "react";

interface ScrollAnimationProps {
    children: ReactNode;
    direction?: "left" | "right" | "up" | "down" | "none";
    delay?: number;
    duration?: number;
    distance?: number;
    fade?: boolean;
    className?: string;
    viewport?: UseInViewOptions;
    once?: boolean;
}

export default function ScrollAnimation({
    children,
    direction = "up",
    delay = 0,
    duration = 0.5,
    distance = 50,
    fade = true,
    className = "",
    viewport = { amount: 0.3, margin: "0px 0px -50px 0px" },
    once = true,
}: ScrollAnimationProps) {
    const ref = useRef(null);
    const isInView = useInView(ref, { once, ...viewport });

    const variants: Variants = {
        hidden: {
            opacity: fade ? 0 : 1,
            x: direction === "left" ? -distance : direction === "right" ? distance : 0,
            y: direction === "up" ? distance : direction === "down" ? -distance : 0,
        },
        visible: {
            opacity: 1,
            x: 0,
            y: 0,
            transition: {
                duration: duration,
                delay: delay,
                ease: "easeOut",
            },
        },
    };

    return (
        <motion.div
            ref={ref}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            variants={variants}
            className={className}
        >
            {children}
        </motion.div>
    );
}
