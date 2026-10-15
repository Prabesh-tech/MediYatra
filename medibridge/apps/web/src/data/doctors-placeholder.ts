// PLACEHOLDER DATA: replace with real, approved doctor information before launch
export const placeholderDoctors = Array.from({ length: 8 }, (_, index) => {
  const number = index + 1;
  const slug = `doctor-${number}`;

  return {
    slug,
    name: `Doctor Name ${number}`,
    role: "Specialty",
    image: null,
  };
});
