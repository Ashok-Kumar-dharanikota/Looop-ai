import { Host, Column, RNHostView } from '@expo/ui';
import { StyleSheet, View } from 'react-native';
import type { NativeCardProps } from './types';

export function NativeCard({
  children,
  style,
  backgroundColor,
  borderColor,
  borderWidth,
  borderRadius,
  padding,
  modifiers,
  testID,
}: NativeCardProps) {
  const flatStyle = StyleSheet.flatten(style) || {};

  const resolvedBg = backgroundColor ?? flatStyle.backgroundColor ?? '#FFFFFF';
  const resolvedBorderColor = borderColor ?? flatStyle.borderColor ?? 'rgba(15, 23, 42, 0.08)';
  const resolvedBorderWidth = borderWidth ?? (typeof flatStyle.borderWidth === 'number' ? flatStyle.borderWidth : 1);
  const resolvedRadius = borderRadius ?? (typeof flatStyle.borderRadius === 'number' ? flatStyle.borderRadius : 24);
  const resolvedPadding = padding ?? (typeof flatStyle.padding === 'number' ? flatStyle.padding : 18);

  return (
    <Host
      matchContents
      style={[
        styles.host,
        flatStyle.marginBottom != null ? { marginBottom: flatStyle.marginBottom } : undefined,
        flatStyle.marginTop != null ? { marginTop: flatStyle.marginTop } : undefined,
      ]}
    >
      <Column
        style={{
          backgroundColor: resolvedBg,
          borderColor: resolvedBorderColor,
          borderWidth: resolvedBorderWidth,
          borderRadius: resolvedRadius,
          padding: resolvedPadding,
        }}
        modifiers={modifiers}
        testID={testID}
      >
        <RNHostView matchContents style={styles.rnhost}>
          <View style={styles.innerContent}>
            {children}
          </View>
        </RNHostView>
      </Column>
    </Host>
  );
}

const styles = StyleSheet.create({
  host: {
    width: '100%',
    marginBottom: 16,
  },
  rnhost: {
    width: '100%',
  },
  innerContent: {
    width: '100%',
  },
});
