import React, {
  useState,
  createContext,
  useContext,
  useRef,
  ReactNode,
  Children,
  useCallback,
} from "react";
import { View, StyleSheet, Modal, TouchableOpacity } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  interpolate,
  Easing,
  withSpring,
} from "react-native-reanimated";
import * as Haptics from "expo-haptics";

import { SCREEN_WIDTH, SCREEN_HEIGHT, SPACING } from "./const";
import type {
  ContentProps,
  DropdownContextValue,
  ItemProps,
  Styles,
  TriggerLayout,
  TriggerProps,
} from "./types";

const DropdownContext = createContext<DropdownContextValue | undefined>(
  undefined,
);

const useDropdownContext = (): DropdownContextValue => {
  const context = useContext(DropdownContext);
  if (!context)
    throw new Error("Dropdown components must be used within a Dropdown");
  return context;
};

interface DropdownProps {
  children: ReactNode;
}

const Dropdown = ({ children }: DropdownProps): React.ReactElement => {
  const [visible, setVisible] = useState<boolean>(false);
  const [triggerLayout, setTriggerLayout] = useState<TriggerLayout | null>(
    null,
  );
  const flipAnim = useSharedValue<number>(0);
  const activeItemIndex = useSharedValue<number>(-1);

  const open = (): void => {
    setVisible(true);
    flipAnim.value = withSpring(1, {
      damping: 15,
      stiffness: 150,
      mass: 0.8,
    });
  };

  const close = (): void => {
    flipAnim.value = withTiming(0, {
      duration: 180,
      easing: Easing.bezier(0.4, 0, 0.6, 1),
    });
    activeItemIndex.value = -1;
    setTimeout(() => setVisible(false), 180);
  };

  return (
    <DropdownContext.Provider
      value={{
        visible,
        open,
        close,
        triggerLayout,
        setTriggerLayout,
        flipAnim,
        activeItemIndex,
      }}
    >
      {children}
    </DropdownContext.Provider>
  );
};

const Trigger = ({ children, style }: TriggerProps): React.ReactElement => {
  const { open, setTriggerLayout } = useDropdownContext();
  const triggerRef = useRef<View>(null);

  const handlePress = (): void => {
    triggerRef.current?.measure(
      (
        _x: number,
        _y: number,
        width: number,
        height: number,
        pageX: number,
        pageY: number,
      ) => {
        setTriggerLayout({ x: pageX, y: pageY, width, height });
        open();
      },
    );
  };

  return (
    <TouchableOpacity
      ref={triggerRef}
      onPress={handlePress}
      style={style}
      activeOpacity={0.75}
    >
      {children}
    </TouchableOpacity>
  );
};

const Content = ({
  children,
  style,
  position = "auto",
}: ContentProps): React.ReactElement | null => {
  const { visible, close, triggerLayout, flipAnim } = useDropdownContext();
  const contentRef = useRef<View>(null);
  const [contentDimensions, setContentDimensions] = useState<{
    width: number;
    height: number;
  } | null>(null);

  const calculatePosition = useCallback(() => {
    if (!triggerLayout || !contentDimensions) return { top: 0, left: 0 };

    const { x, y, width, height } = triggerLayout;
    const { width: contentWidth, height: contentHeight } = contentDimensions;

    let top = y + height + SPACING;
    let left = x;

    if (position === "auto") {
      const spaceBelow = SCREEN_HEIGHT - (y + height);
      const spaceAbove = y;

      if (spaceBelow >= contentHeight + SPACING) {
        top = y + height + SPACING;
      } else if (spaceAbove >= contentHeight + SPACING) {
        top = y - contentHeight - SPACING;
      } else {
        top =
          spaceBelow > spaceAbove
            ? y + height + SPACING
            : Math.max(SPACING, y - contentHeight - SPACING);
      }

      if (x + contentWidth > SCREEN_WIDTH - SPACING) {
        left = Math.max(SPACING, x + width - contentWidth);
      }

      if (left < SPACING) left = SPACING;

      if (left + contentWidth > SCREEN_WIDTH - SPACING) {
        left = SCREEN_WIDTH - contentWidth - SPACING;
      }
    } else if (position === "top") {
      top = y - contentHeight - SPACING;
    } else if (position === "bottom") {
      top = y + height + SPACING;
    } else if (position === "left") {
      left = x - contentWidth - SPACING;
      top = y;
    } else if (position === "right") {
      left = x + width + SPACING;
      top = y;
    }

    top = Math.max(
      SPACING,
      Math.min(top, SCREEN_HEIGHT - contentHeight - SPACING),
    );
    left = Math.max(
      SPACING,
      Math.min(left, SCREEN_WIDTH - contentWidth - SPACING),
    );

    return { top, left };
  }, [triggerLayout, contentDimensions, position]);

  const { top, left } = calculatePosition();

  const animatedStyle = useAnimatedStyle(() => {
    const progress = flipAnim.value;

    return {
      opacity: interpolate(progress, [0, 0.5, 1], [0, 0.5, 1]),
      transform: [
        { perspective: 900 },
        {
          scale: interpolate(progress, [0, 1], [0.95, 1]),
        },
      ],
      transformOrigin: "top center",
    };
  });

  if (!visible || !triggerLayout) return null;

  const childrenWithIndex = Children.map(children, (child, index) =>
    React.isValidElement(child)
      ? React.cloneElement(child, { ...(child.props as object), index } as any)
      : child,
  );

  return (
    <Modal
      transparent
      visible={visible}
      onRequestClose={close}
      animationType="none"
    >
      <TouchableOpacity
        style={styles.overlay}
        activeOpacity={1}
        onPress={close}
      >
        <Animated.View
          ref={contentRef}
          onLayout={(e) => {
            const { width, height } = e.nativeEvent.layout;
            setContentDimensions({ width, height });
          }}
          style={[
            styles.content,
            style,
            {
              top: contentDimensions
                ? top
                : triggerLayout.y + triggerLayout.height + SPACING,
              left: contentDimensions ? left : triggerLayout.x,
              minWidth: triggerLayout.width,
            },
            animatedStyle,
          ]}
        >
          {childrenWithIndex}
        </Animated.View>
      </TouchableOpacity>
    </Modal>
  );
};

const Item = ({
  children,
  onPress,
  style,
}: ItemProps): React.ReactElement => {
  const { close } = useDropdownContext();

  const handlePress = (): void => {
    onPress?.();
    close();
  };

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={handlePress}
      style={[styles.item, style]}
    >
      {children}
    </TouchableOpacity>
  );
};

Dropdown.Trigger = Trigger;
Dropdown.Content = Content;
Dropdown.Item = Item;

const styles = StyleSheet.create<Styles>({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.1)',
  },
  content: {
    position: "absolute",
    borderRadius: 14,
    padding: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 10,
    backgroundColor: "#FFFFFF",
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 11,
    paddingHorizontal: 14,
    borderRadius: 10,
  },
});

export default Dropdown;
