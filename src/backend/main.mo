import Array "mo:core/Array";
import Map "mo:core/Map";
import Iter "mo:core/Iter";
import Order "mo:core/Order";
import Nat "mo:core/Nat";
import Runtime "mo:core/Runtime";

actor {
  type Category = {
    #Birthday;
    #Marriage;
    #Funeral;
  };

  module Category {
    public func compare(cat1 : Category, cat2 : Category) : Order.Order {
      switch (cat1, cat2) {
        case (#Birthday, #Birthday) { #equal };
        case (#Birthday, _) { #less };
        case (#Marriage, #Birthday) { #greater };
        case (#Marriage, #Marriage) { #equal };
        case (#Marriage, #Funeral) { #less };
        case (#Funeral, #Funeral) { #equal };
        case (#Funeral, _) { #greater };
      };
    };
  };

  type DecorationType = {
    #Flower;
    #Balloon;
  };

  module DecorationType {
    public func compare(type1 : DecorationType, type2 : DecorationType) : Order.Order {
      switch (type1, type2) {
        case (#Balloon, #Balloon) { #equal };
        case (#Balloon, #Flower) { #less };
        case (#Flower, #Balloon) { #greater };
        case (#Flower, #Flower) { #equal };
      };
    };
  };

  type DecorationItem = {
    id : Nat;
    name : Text;
    description : Text;
    price : Nat;
    category : Category;
    typ : DecorationType;
    imageUrl : Text;
  };

  module DecorationItem {
    public func compareById(item1 : DecorationItem, item2 : DecorationItem) : Order.Order {
      Nat.compare(item1.id, item2.id);
    };

    public func compareByCategory(item1 : DecorationItem, item2 : DecorationItem) : Order.Order {
      switch (Category.compare(item1.category, item2.category)) {
        case (#equal) { DecorationType.compare(item1.typ, item2.typ) };
        case (order) { order };
      };
    };
  };

  let catalog = Map.empty<Nat, DecorationItem>();

  catalog.add(
    1,
    {
      id = 1;
      name = "Birthday Flowers";
      description = "Colorful flowers for birthdays";
      price = 2999;
      category = #Birthday;
      typ = #Flower;
      imageUrl = "https://images.unsplash.com/photo-1506744038136-46273834b3fb";
    },
  );
  catalog.add(
    2,
    {
      id = 2;
      name = "Birthday Balloons";
      description = "Vibrant balloons for birthday parties";
      price = 1499;
      category = #Birthday;
      typ = #Balloon;
      imageUrl = "https://images.unsplash.com/photo-1506744038136-46273834b3fb";
    },
  );
  catalog.add(
    3,
    {
      id = 3;
      name = "Birthday Bouquet";
      description = "Beautiful birthday themed bouquet";
      price = 3999;
      category = #Birthday;
      typ = #Flower;
      imageUrl = "https://images.unsplash.com/photo-1506744038136-46273834b3fb";
    },
  );

  catalog.add(
    4,
    {
      id = 4;
      name = "Marriage Flowers";
      description = "Elegant flowers for weddings";
      price = 4999;
      category = #Marriage;
      typ = #Flower;
      imageUrl = "https://images.unsplash.com/photo-1506744038136-46273834b3fb";
    },
  );
  catalog.add(
    5,
    {
      id = 5;
      name = "Marriage Balloons";
      description = "Stylish balloons for wedding celebrations";
      price = 2199;
      category = #Marriage;
      typ = #Balloon;
      imageUrl = "https://images.unsplash.com/photo-1506744038136-46273834b3fb";
    },
  );
  catalog.add(
    6,
    {
      id = 6;
      name = "Marriage Bouquet";
      description = "Lovely bouquet for marriage ceremonies";
      price = 4299;
      category = #Marriage;
      typ = #Flower;
      imageUrl = "https://images.unsplash.com/photo-1506744038136-46273834b3fb";
    },
  );

  catalog.add(
    7,
    {
      id = 7;
      name = "Funeral Flowers";
      description = "Respectful flowers for funerals";
      price = 3499;
      category = #Funeral;
      typ = #Flower;
      imageUrl = "https://images.unsplash.com/photo-1506744038136-46273834b3fb";
    },
  );
  catalog.add(
    8,
    {
      id = 8;
      name = "Funeral Balloons";
      description = "Subdued balloons suitable for funerals";
      price = 1299;
      category = #Funeral;
      typ = #Balloon;
      imageUrl = "https://images.unsplash.com/photo-1506744038136-46273834b3fb";
    },
  );
  catalog.add(
    9,
    {
      id = 9;
      name = "Funeral Bouquet";
      description = "Elegant funeral themed bouquet";
      price = 3899;
      category = #Funeral;
      typ = #Flower;
      imageUrl = "https://images.unsplash.com/photo-1506744038136-46273834b3fb";
    },
  );

  public query ({ caller }) func getItem(id : Nat) : async DecorationItem {
    switch (catalog.get(id)) {
      case (?item) { item };
      case (null) { Runtime.trap("Item not found") };
    };
  };

  public query ({ caller }) func getAllItems() : async [DecorationItem] {
    catalog.values().toArray().sort(DecorationItem.compareById);
  };

  public query ({ caller }) func getItemsByCategory(category : Category) : async [DecorationItem] {
    catalog.values().toArray().filter(
      func(item) { item.category == category }
    ).sort(DecorationItem.compareById);
  };
};
