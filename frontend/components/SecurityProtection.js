"use client";

import { useEffect } from 'react';

export default function SecurityProtection() {
  useEffect(() => {
    // Disable right-click
    const handleContextMenu = (e) => {
      e.preventDefault();
      return false;
    };

    // Disable F12, Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+U, Ctrl+S
    const handleKeyDown = (e) => {
      // F12
      if (e.key === 'F12') {
        e.preventDefault();
        return false;
      }
      
      // Ctrl+Shift+I (Inspect)
      if (e.ctrlKey && e.shiftKey && e.key === 'I') {
        e.preventDefault();
        return false;
      }
      
      // Ctrl+Shift+J (Console)
      if (e.ctrlKey && e.shiftKey && e.key === 'J') {
        e.preventDefault();
        return false;
      }
      
      // Ctrl+Shift+C (Inspect Element)
      if (e.ctrlKey && e.shiftKey && e.key === 'C') {
        e.preventDefault();
        return false;
      }
      
      // Ctrl+U (View Source)
      if (e.ctrlKey && e.key === 'u') {
        e.preventDefault();
        return false;
      }
      
      // Ctrl+S (Save Page)
      if (e.ctrlKey && e.key === 's') {
        e.preventDefault();
        return false;
      }

      // Ctrl+Shift+K (Firefox Console)
      if (e.ctrlKey && e.shiftKey && e.key === 'K') {
        e.preventDefault();
        return false;
      }

      // Cmd+Option+I (Mac Inspect)
      if (e.metaKey && e.altKey && e.key === 'i') {
        e.preventDefault();
        return false;
      }

      // Cmd+Option+J (Mac Console)
      if (e.metaKey && e.altKey && e.key === 'j') {
        e.preventDefault();
        return false;
      }

      // Cmd+Option+C (Mac Inspect Element)
      if (e.metaKey && e.altKey && e.key === 'c') {
        e.preventDefault();
        return false;
      }

      // Cmd+U (Mac View Source)
      if (e.metaKey && e.key === 'u') {
        e.preventDefault();
        return false;
      }
    };

    // Detect DevTools
    const detectDevTools = () => {
      const threshold = 160;
      const widthThreshold = window.outerWidth - window.innerWidth > threshold;
      const heightThreshold = window.outerHeight - window.innerHeight > threshold;
      
      if (widthThreshold || heightThreshold) {
        // DevTools is likely open - you can redirect or show a message
        document.body.innerHTML = '<div style="display:flex;align-items:center;justify-content:center;height:100vh;font-family:sans-serif;"><h1>Developer tools are not allowed</h1></div>';
      }
    };

    // Disable text selection (optional - might affect UX)
    const disableTextSelection = (e) => {
      if (e.target.tagName !== 'INPUT' && e.target.tagName !== 'TEXTAREA') {
        // Allow selection in input fields
        return true;
      }
    };

    // Disable drag and drop of images
    const handleDragStart = (e) => {
      if (e.target.tagName === 'IMG') {
        e.preventDefault();
        return false;
      }
    };

    // Disable copy (Ctrl+C)
    const handleCopy = (e) => {
      // Allow copy in input and textarea fields
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
        return true;
      }
      e.preventDefault();
      return false;
    };

    // Disable printing
    const handleBeforePrint = (e) => {
      e.preventDefault();
      return false;
    };

    // Add event listeners
    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('dragstart', handleDragStart);
    document.addEventListener('copy', handleCopy);
    window.addEventListener('beforeprint', handleBeforePrint);

    // Check for DevTools periodically
    const devToolsInterval = setInterval(detectDevTools, 1000);

    // Disable console methods
    if (typeof window !== 'undefined') {
      const noop = () => {};
      window.console.log = noop;
      window.console.warn = noop;
      window.console.error = noop;
      window.console.info = noop;
      window.console.debug = noop;
    }

    // Cleanup
    return () => {
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('dragstart', handleDragStart);
      document.removeEventListener('copy', handleCopy);
      window.removeEventListener('beforeprint', handleBeforePrint);
      clearInterval(devToolsInterval);
    };
  }, []);

  return null; // This component doesn't render anything
}
