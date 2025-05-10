import { useRef, useEffect } from 'react';
import { Animated, Easing } from 'react-native';

/**
 * Custom hook for accordion animation effects
 * @param {boolean} expanded - Whether the accordion is expanded or collapsed
 * @returns {object} Animation values and interpolations
 */
export default function useAccordionAnimation(expanded) {
  const animatedController = useRef(new Animated.Value(0)).current;
  const bodyHeight = useRef(new Animated.Value(0)).current;
  const bodyOpacity = useRef(new Animated.Value(0)).current;
  
  const rotateArrow = animatedController.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg']
  });

  // Accordion animation effect
  useEffect(() => {
    if (expanded) {
      Animated.parallel([
        Animated.timing(animatedController, {
          duration: 300,
          toValue: 1,
          easing: Easing.bezier(0.4, 0.0, 0.2, 1),
          useNativeDriver: false
        }),
        Animated.timing(bodyOpacity, {
          duration: 300,
          toValue: 1,
          useNativeDriver: false
        }),
        Animated.spring(bodyHeight, {
          toValue: 1,
          friction: 7,
          useNativeDriver: false
        })
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(animatedController, {
          duration: 300,
          toValue: 0,
          easing: Easing.bezier(0.4, 0.0, 0.2, 1),
          useNativeDriver: false
        }),
        Animated.timing(bodyOpacity, {
          duration: 200,
          toValue: 0,
          useNativeDriver: false
        }),
        Animated.timing(bodyHeight, {
          duration: 300,
          toValue: 0,
          useNativeDriver: false
        })
      ]).start();
    }
  }, [expanded]);

  // Return animation values and styles for components to use
  return {
    rotateArrow,
    getBodyStyle: () => ({
      opacity: bodyOpacity,
      maxHeight: bodyHeight.interpolate({
        inputRange: [0, 1],
        outputRange: [0, 1000]
      }),
      transform: [{
        translateY: bodyHeight.interpolate({
          inputRange: [0, 1],
          outputRange: [-20, 0]
        })
      }]
    })
  };
}
