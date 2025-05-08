import { StyleSheet } from 'react-native';

// Common colors and values for authentication screens
const colors = {
  primary: '#4CAF50',  // Green color for agriculture theme
  secondary: '#8BC34A',
  textDark: '#333333',
  textLight: '#FFFFFF',
  background: '#F9FBF7',
  error: '#FF5252',
};

// Common spacing and sizing
const metrics = {
  baseSpacing: 10,
  borderRadius: 8,
  inputHeight: 48,
  buttonHeight: 50,
};

// Shared styles for authentication components
export const authStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: metrics.baseSpacing * 2,
  },
  input: {
    height: metrics.inputHeight,
    borderWidth: 1,
    borderColor: colors.secondary,
    borderRadius: metrics.borderRadius,
    paddingHorizontal: metrics.baseSpacing,
    marginBottom: metrics.baseSpacing * 1.5,
    backgroundColor: colors.textLight,
  },
  button: {
    height: metrics.buttonHeight,
    backgroundColor: colors.primary,
    borderRadius: metrics.borderRadius,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: metrics.baseSpacing,
  },
  buttonText: {
    color: colors.textLight,
    fontSize: 16,
    fontWeight: '600',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.textDark,
    marginBottom: metrics.baseSpacing * 3,
    textAlign: 'center',
  },
  errorText: {
    color: colors.error,
    marginBottom: metrics.baseSpacing,
  },
  link: {
    color: colors.primary,
    textAlign: 'center',
    marginTop: metrics.baseSpacing * 2,
  }
});

// Export colors and metrics to be used directly when needed
export { colors, metrics };
