import { useEffect, useRef } from 'react';

export function useTabIndicator(activeTab) {
    const tabRefs = useRef({});
    const indicatorRef = useRef(null);
    const navTabsRef = useRef(null);

    useEffect(() => {
        if (indicatorRef.current && tabRefs.current[activeTab] && navTabsRef.current) {
            const activeElement = tabRefs.current[activeTab];
            const navTabsElement = navTabsRef.current;

            const activeRect = activeElement.getBoundingClientRect();
            const navTabsRect = navTabsElement.getBoundingClientRect();

            const offsetLeft = activeRect.left - navTabsRect.left;
            const width = activeElement.offsetWidth;

            indicatorRef.current.style.width = `${width}px`;
            indicatorRef.current.style.transform = `translateX(${offsetLeft}px)`;
        }
    }, [activeTab]);

    return { tabRefs, indicatorRef, navTabsRef };
}