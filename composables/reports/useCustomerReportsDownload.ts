export const useCustomerReportsDownload = () => {
  let downloading = ref(false)
  async function downloadExcel(id: number) {
    try {
      downloading.value = true
      const response = await $larafetchBlob(`/report/customer/${id}/download-excel`);

      // Check if the response is valid
      if (response) {
        // Create a Blob from the Excel file data
        
        const blob = new Blob([response], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });

        // Create a URL for the Blob
        const url = window.URL.createObjectURL(blob);

        // Create a download link
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'customer_report.xlsx');

        // Append the link to the document body and click it to trigger the download
        document.body.appendChild(link);
        link.click();

        // Clean up by removing the link
        document.body.removeChild(link);
        downloading.value = false
      } else {
        console.error('Invalid response received.');
      }
    } catch (error) {
      console.error('Error downloading Excel:', error);
    }
  }

  async function downloadCsv(id: number) {
    try {
      downloading.value = true
      const response: any = await $larafetchBlob(`/report/customer/${id}/download-csv`);
      // Check if the response is valid
      if (response) {
        const csvData = response; // Assuming the CSV data is directly returned from the server

        // Create a Blob from the CSV data
        const blob = new Blob([csvData], { type: 'text/csv' });

        // Create a URL for the Blob
        const url = window.URL.createObjectURL(blob);

        // Create a download link
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'customer_report.csv');

        // Append the link to the document body and click it to trigger the download
        document.body.appendChild(link);
        link.click();

        // Clean up by removing the link
        document.body.removeChild(link);
        downloading.value = false
      } else {
        console.error('Invalid response received.');
      }
    } catch (error) {
      console.error('Error downloading CSV:', error);
    }
  }



  return {
    downloadExcel,
    downloadCsv,
    downloading
  };
};
