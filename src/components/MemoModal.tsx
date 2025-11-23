import React from "react";
import {
  Modal,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

interface MemoModalProps {
  visible: boolean;
  selectedDate: Date;
  memoText: string;
  hasMemo: boolean;
  onClose: () => void;
  onMemoTextChange: (text: string) => void;
  onSave: () => void;
  onDelete: () => void;
}

export function MemoModal({
  visible,
  selectedDate,
  memoText,
  hasMemo,
  onClose,
  onMemoTextChange,
  onSave,
  onDelete,
}: MemoModalProps) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View className="flex-1 bg-black/50 justify-center items-center">
        <View className="bg-white rounded-xl p-6 w-[90%] max-w-md">
          <Text className="text-lg font-bold text-gray-800 mb-4">
            {selectedDate.getMonth() + 1}月{selectedDate.getDate()}日のメモ
          </Text>

          <TextInput
            value={memoText}
            onChangeText={onMemoTextChange}
            placeholder="メモを入力..."
            multiline
            numberOfLines={4}
            className="border border-gray-300 rounded-lg p-3 mb-4 text-gray-800"
            style={{ textAlignVertical: "top" }}
          />

          <View className="flex-row justify-end space-x-2">
            {hasMemo && (
              <TouchableOpacity
                onPress={onDelete}
                className="bg-red-500 px-4 py-2 rounded-lg mr-2"
              >
                <Text className="text-white font-medium">削除</Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity
              onPress={onClose}
              className="bg-gray-300 px-4 py-2 rounded-lg mr-2"
            >
              <Text className="text-gray-700 font-medium">キャンセル</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={onSave}
              className="bg-indigo-500 px-4 py-2 rounded-lg"
            >
              <Text className="text-white font-medium">保存</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}
