import React, { ReactNode } from 'react';
import { Keyboard, TouchableWithoutFeedback, View } from 'react-native';

interface DismissKeyboardProps {
    children: ReactNode;
  }

const DismissKeyboardView = ({ children } : DismissKeyboardProps) => (
  <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
    <View style={{ flex: 1 }}>
        {children}
    </View>
  </TouchableWithoutFeedback>
);

export default DismissKeyboardView;