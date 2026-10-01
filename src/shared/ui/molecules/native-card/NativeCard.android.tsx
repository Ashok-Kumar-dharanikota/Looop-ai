import { Host, Card } from '@expo/ui/jetpack-compose';
import { clip, Shapes } from '@expo/ui/jetpack-compose/modifiers';
import { RNHostView } from '@expo/ui';
import { StyleSheet, View } from 'react-native';
import type { NativeCardProps } from './types';

export function NativeCard({
  children,
  style,
  backgroundColor,
  borderColor,
  borderWidth,
  borderRadius,
  elevation,
  padding,
  modifiers = [],
  testID,
}: NativeCardProps) {
  const flatStyle = StyleSheet.flatten(style) || {};

  const resolvedBg = backgroundColor ?? flatStyle.backgroundColor ?? '#FFFFFF';
  const resolvedBorderColor = borderColor ?? flatStyle.borderColor ?? 'rgba(15, 23, 42, 0.08)';
  const resolvedBorderWidth = borderWidth ?? (typeof flatStyle.borderWidth === 'number' ? flatStyle.borderWidth : 1);
  const resolvedRadius = borderRadius ?? (typeof flatStyle.borderRadius === 'number' ? flatStyle.borderRadius : 24);
  const resolvedPadding = padding ?? (typeof flatStyle.padding === 'number' ? flatStyle.padding : 18);
  const resolvedElevation = elevation ?? (typeof flatStyle.elevation === 'number' ? flatStyle.elevation : 2);

  const cardModifiers = [
    clip(Shapes.RoundedCorner(resolvedRadius)),
    ...modifiers,
  ];

  return (
    <Host
      matchContents
      style={[
        styles.host,
        flatStyle.marginBottom != null ? { marginBottom: flatStyle.marginBottom } : undefined,
        flatStyle.marginTop != null ? { marginTop: flatStyle.marginTop } : undefined,
      ]}
    >
      <Card
        colors={{ containerColor: resolvedBg }}
        border={{ width: resolvedBorderWidth, color: resolvedBorderColor }}
        elevation={resolvedElevation}
        modifiers={cardModifiers}
      >
        <RNHostView matchContents style={styles.rnhost}>
          <View style={[styles.innerContent, { padding: resolvedPadding }]} testID={testID}>
            {children}
          </View>
        </RNHostView>
      </Card>
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
