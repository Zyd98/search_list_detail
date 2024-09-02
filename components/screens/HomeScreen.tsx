import React, { useState, useEffect, useCallback } from 'react';
import { View, TextInput, FlatList, Text, TouchableOpacity, ActivityIndicator, StyleSheet } from 'react-native';
import { useDispatch} from 'react-redux';
import axios from 'axios';
import { setSelectedResult } from '../redux/searchReducer';
import { StackNavigationProp } from '@react-navigation/stack';

type HomeScreenProps = {
  navigation: StackNavigationProp<any, 'Home'>;
};

interface ItemDetail {
  mal_id: number;
  title: string;
  synopsis: string;
  episodes: number;
  score: number;
  status: string;
}

const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [lists, setLists] = useState<ItemDetail[]>([]);
  const [page, setPage] = useState(1);
  const dispatch = useDispatch();

  const handleSearch = useCallback(async (text: string, newPage = 1) => {
    try {
      if (newPage === 1) {
        setLists([]);
      }
      setLoading(true);

      const response = await axios.get<any>(`https://api.jikan.moe/v4/anime?q=${text}&limit=10&order_by=popularity&sort=asc&page=${newPage}`);
      const results: ItemDetail[] = response.data.data;
      setLists(prevLists => [...prevLists, ...results]);

    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  }, [setLists]);

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (query.trim() !== '') {
        handleSearch(query, 1);
      } else {
        setLists([]);
        setPage(1);
      }
    }, 500);

    return () => clearTimeout(delayDebounce);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);



  const handlePress = (item: ItemDetail) => {
    dispatch(setSelectedResult(item));
    navigation.navigate('Result');
  };

  const renderPost = ({ item }: { item: ItemDetail }) => {
    return (
      <TouchableOpacity onPress={() => handlePress(item)}>
        <View style={styles.itemListView}>
          <Text style={styles.itemListText}>
              {item.title}
          </Text>
        </View>
        </TouchableOpacity>
    );
  };

  return (
    <View style={styles.viewScreen}>
      <TextInput
        placeholder="Search anime by title"
        value={query}
        onChangeText={text => {
          setPage(1);
          setQuery(text);
        }}
        style={styles.searchInput}
      />
      {loading && page === 1 ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <FlatList
        data={lists}
        style={styles.resultList}
        bounces={false}
        showsVerticalScrollIndicator={false}
        keyExtractor={(item) => item.mal_id.toString()}
        renderItem={renderPost}
        onEndReached={() => {
          if (query !== '') {
            setPage(prevPage => {
              const newPage = prevPage + 1;
              handleSearch(query, newPage);
              return newPage;
            });
          }
        }}
        onEndReachedThreshold={0.6}
        ListEmptyComponent={<Text style={styles.emptyComponentList}>No results found</Text>}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  viewScreen: {
    flex: 1,
    padding: 16,
    backgroundColor: 'white',
 },
 searchInput: {
  height: 40,
  borderColor: 'black',
  borderWidth: 1,
  marginBottom: 16,
  paddingLeft: 8,
},
  resultList: {
    flex: 1,
    padding: 5,
  },
  emptyComponentList: {
    textAlign: 'center',
  },
  itemListView: {
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: 'gray',
    borderBottomWidth: 1,
 },
  itemListText: {
    margin: 18,
    color:'green',
 },
});

export default HomeScreen;
