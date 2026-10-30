import { NativeTabs } from 'expo-router/native-tabs';

export default function AppTabs() {
  
  return (
    <NativeTabs

      // Nav bar background
      backgroundColor="FFFFFF"

      // selected tab color
      tintColor="#3D622C"

      // Icon colors
      iconColor={{
        default: "#777777",
        selected: "#3D622C",
      }}

      //Selected tab indicator 
      indicatorColor="#DDF5DF"

      // color when pressing a tab
      rippleColor="#EAF4E6"

      // navigation styling
      labelStyle={{ 
        default:  {
          color: "#777777",
          fontSize: 12,
        },
                
        selected: {
          color: "#3D622C",
          fontSize: 12,
          fontWeight: "700",
        },
         }}
         
         labelVisibilityMode="labeled"
         >

          {/*== Home Tab ==*/}

      <NativeTabs.Trigger name="index">

        <NativeTabs.Trigger.Label>
          Home
          </NativeTabs.Trigger.Label>
        
        <NativeTabs.Trigger.Icon
          sf="house.fill"
          md="home"
        />

      </NativeTabs.Trigger>

      {/*== Explore Tab ==*/}

      <NativeTabs.Trigger name="explore">

        <NativeTabs.Trigger.Label>
          Explore
          </NativeTabs.Trigger.Label>
        
        <NativeTabs.Trigger.Icon
          sf="magnifyingglass"
          md="search"
        />

      </NativeTabs.Trigger>


   {/*== Favorite Tab ==*/}

      <NativeTabs.Trigger name="favorites">

        <NativeTabs.Trigger.Label>
          Favorites
          </NativeTabs.Trigger.Label>
        
        <NativeTabs.Trigger.Icon
          sf={{ default: "heart" , selected: "heart.fill" }}
          md="favorite"
        />

      </NativeTabs.Trigger>

   {/*== Profile  Tab ==*/}

      <NativeTabs.Trigger name="profile">

        <NativeTabs.Trigger.Label>
          Profile
          </NativeTabs.Trigger.Label>
        
        <NativeTabs.Trigger.Icon
          sf={{ default: "person.crop.circle",
                selected: "person.crop.circle.fill"
          }}
          md="person"
        />

      </NativeTabs.Trigger>



    </NativeTabs>

  );
}
