import { NativeTabs } from 'expo-router/native-tabs';

export default function AppTabs() {
  
  return (
    <NativeTabs

      // Nav bar background
      backgroundColor="#3D622C"

      // selected tab color
      tintColor="#FFFFFF"

      // Icon colors
      iconColor={{
        default: "#DCE8D6",
        selected: "#FFFFFF",
      }}

      //Selected tab indicator 
      indicatorColor="#559439"

      // color when pressing a tab
      rippleColor="#6E9439"

      // navigation styling
      labelStyle={{ 
        default:  {
          color: "#DCE8D6",
          fontSize: 12,
        },
                
        selected: {
          color: "#FFFFFF",
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




      {/*== Resources Tab ==*/}

      <NativeTabs.Trigger name="resources">

        <NativeTabs.Trigger.Label>
          Resources
          </NativeTabs.Trigger.Label>
        
        <NativeTabs.Trigger.Icon
          sf="books.vertical"
          md="menu_book"
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
