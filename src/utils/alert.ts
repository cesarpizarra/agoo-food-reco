import Swal from "sweetalert2";

export const showConfirmDialog = async (
  title: string,
  text: string,
  confirmButtonText = "Yes, proceed",
  cancelButtonText = "Cancel",
) => {
  const result = await Swal.fire({
    title,
    text,
    icon: "question",
    showCancelButton: true,
    confirmButtonText,
    cancelButtonText,
    reverseButtons: false,
  });

  return result.isConfirmed;
};
