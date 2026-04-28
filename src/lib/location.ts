export function getSavedLocation() {
  const data = localStorage.getItem("user_location");
  return data ? JSON.parse(data) : null;
}

export function saveLocation(loc: any) {
  localStorage.setItem("user_location", JSON.stringify(loc));
}

export async function fetchIPLocation() {
  const res = await fetch("https://ipapi.co/json/");
  const data = await res.json();

  return {
    city: data.city,
    state: data.region,
    pincode: data.postal,
    area: data.city,
  };
}

export async function fetchLocationsByPincode(pincode: string) {
  const res = await fetch(`https://api.postalpincode.in/pincode/${pincode}`);
  const data = await res.json();
  return data[0].PostOffice || [];
}
