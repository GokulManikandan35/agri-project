import { StyleSheet } from 'react-native';
import { colors, metrics } from './index';

export const loginStyles = StyleSheet.create({
  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: metrics.baseSpacing * 2,
    color: colors.primary,
  },
  socialButtonContainer: {
    marginTop: metrics.baseSpacing * 3,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: metrics.baseSpacing * 2,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: colors.secondary,
  },
  dividerText: {
    marginHorizontal: metrics.baseSpacing,
    color: colors.textDark,
  },
});
