import { useState, useEffect, useContext, useRef } from "react";
import { AuthContext } from "../contexts";
import { createPortal } from "react-dom";
import { useInfiniteQuery } from "@tanstack/react-query";

export const useLocalStorage = (key = "value", initialValue = []) => {
  // retrieve the stored value from localStorage
  const storedValue = localStorage.getItem(key);
  // initialize the state with the stored value or the initial value
  const [value, setValue] = useState(
    storedValue !== null ? JSON.parse(storedValue) : initialValue
  );

  // update the localStorage whenever the value changes
  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  // function to update the value in localStorage and state
  const updateValue = (newValue) => {
    setValue(newValue);
  };

  return [value, updateValue];
};

export const useAuth = () => {
  const { auth, setAuth } = useContext(AuthContext);

  return { auth, setAuth };
};

export const useDebounce = (value, delay = 500) => {
  const [debounceValue, setDebounceValue] = useState(value);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebounceValue(value);
    }, delay);

    return () => clearTimeout(timeout);
  }, [value, delay]);

  return debounceValue;
};

export const usePortal = (domNode) => {
  const portalRoot = domNode || document.getElementById("portal-root");

  const Portal = ({ children }) => {
    return createPortal(children, portalRoot);
  };

  return { Portal };
};

export const useInfiniteScrolling = (queryKey, queryFn, options = {}) => {
    const { getNextPageParam } = options;
  
    const loaderRef = useRef(null);
  
    const { data, isSuccess, isLoading, isError, fetchNextPage, hasNextPage } =
      useInfiniteQuery(queryKey, queryFn, {
        getNextPageParam,
      });
  
    useEffect(() => {
      const observer = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting && hasNextPage) {
            fetchNextPage();
          }
        },
        { threshold: 1.0 }
      );
  
      if (loaderRef.current) {
        observer.observe(loaderRef.current);
      }
  
      return () => {
        if (loaderRef.current) {
          observer.unobserve(loaderRef.current);
        }
      };
    }, [hasNextPage, fetchNextPage]);
  
    return {
      data,
      isSuccess,
      isLoading,
      isError,
      hasNextPage,
      loaderRef,
    };
  };