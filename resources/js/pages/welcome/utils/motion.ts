import type { Variants } from 'framer-motion';

export const fadeUp: Variants = {
    hidden: { opacity: 0, y: 32 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.75, ease: [0.16, 1, 0.3, 1] },
    },
};

export const fadeIn: Variants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.6 } },
};

export const stagger: Variants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.1 } },
};
