import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const TestimonialCard = ({ testimonial }) => {
  return (
    <View style={styles.container}>
      <View style={styles.quoteContainer}>
        <Ionicons name="quote" size={24} color="#4A8D3D" style={styles.quoteIcon} />
      </View>
      <Text style={styles.testimonialText}>{testimonial.text}</Text>
      <View style={styles.userContainer}>
        <Image source={testimonial.image} style={styles.userImage} />
        <View style={styles.userInfo}>
          <Text style={styles.userName}>{testimonial.name}</Text>
          <Text style={styles.userRole}>{testimonial.role}</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 280,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginRight: 15,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  quoteContainer: {
    marginBottom: 10,
  },
  quoteIcon: {
    opacity: 0.6,
  },
  testimonialText: {
    fontSize: 14,
    color: '#444',
    lineHeight: 20,
    fontStyle: 'italic',
    marginBottom: 15,
  },
  userContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingTop: 15,
  },
  userImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  userRole: {
    fontSize: 12,
    color: '#666',
  },
});

export default TestimonialCard;
