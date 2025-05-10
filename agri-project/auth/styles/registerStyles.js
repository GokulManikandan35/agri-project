import { StyleSheet } from 'react-native';
import { colors, metrics } from './index';

export const registerStyles = StyleSheet.create({
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: metrics.baseSpacing * 2,
  },
  checkboxText: {
    flex: 1,
    marginLeft: metrics.baseSpacing,
    color: colors.textDark,
  },
  termsText: {
    color: colors.primary,
    textDecorationLine: 'underline',
  },
});
