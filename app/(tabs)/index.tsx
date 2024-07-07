import { View } from 'react-native';
import React, { useMemo, useState, useCallback } from 'react';
import ListingsBottomSheet from '@/components/ListingsBottomSheet';
import listingsData from '@/assets/data/airbnb-listings.json';
import ListingsMap from '@/components/ListingsMap';
import listingsDataGeo from '@/assets/data/airbnb-listings.geo.json';
import { Stack } from 'expo-router';
import ExploreHeader from '@/components/ExploreHeader';

const Page = () => {
  const items = useMemo(() => listingsData as any, []);
  const getoItems = useMemo(() => listingsDataGeo, []);
  const [category, setCategory] = useState<any>({
    name: 'Tiny homes',
    icon: 'home',
    types: ['House', 'Condominium', 'Townhouse']
  });

  const onDataChanged = (category: any) => {
    setCategory(category);
  };

  const calculateRating = useCallback((review_scores_rating : number) => { return (Number(review_scores_rating) / 20)}, [])

  const filteredListings =useMemo(() => {
    return items.filter((item) => category.name === 'Trending' ? calculateRating(item.review_scores_rating) > 4.5 : category.types.includes(item.property_type))
  }, [category])

  const filteredGeoListings =useMemo(() => {
    return getoItems.features.filter((item) => category.name === 'Trending' ? calculateRating(item.properties.review_scores_rating) > 4.5 : category.types.includes(item.properties.property_type))
  }, [category])

  return (
    <View style={{ flex: 1, marginTop: 80 }}>
      {/* Define pour custom header */}
      <Stack.Screen
        options={{
          header: () => <ExploreHeader onCategoryChanged={onDataChanged} />,
        }}
      />
      <ListingsMap listings={filteredGeoListings} />
      <ListingsBottomSheet listings={filteredListings} category={category.name} />
    </View>
  );
};

export default Page;
