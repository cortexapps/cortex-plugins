import { Box, Button, Text } from "@chakra-ui/react";

interface PaginationProps {
  currentPage: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
}

export default function SonarQubePagination({
  currentPage,
  totalItems,
  itemsPerPage,
  onPageChange,
}: PaginationProps): JSX.Element {
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const maxPageNumbersToShow = 5;

  const getPageNumbers = (): Array<number | string> => {
    const pageNumbers: Array<number | string> = [];
    const halfMaxPageNumbersToShow = Math.floor(maxPageNumbersToShow / 2);

    if (totalPages <= maxPageNumbersToShow) {
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else if (currentPage <= halfMaxPageNumbersToShow) {
      for (let i = 1; i <= maxPageNumbersToShow; i++) {
        pageNumbers.push(i);
      }
      pageNumbers.push("...");
      pageNumbers.push(totalPages);
    } else if (currentPage + halfMaxPageNumbersToShow >= totalPages) {
      pageNumbers.push(1);
      pageNumbers.push("...");
      for (
        let i = totalPages - maxPageNumbersToShow + 1;
        i <= totalPages;
        i++
      ) {
        pageNumbers.push(i);
      }
    } else {
      pageNumbers.push(1);
      pageNumbers.push("...");
      for (
        let i = currentPage - halfMaxPageNumbersToShow;
        i <= currentPage + halfMaxPageNumbersToShow;
        i++
      ) {
        pageNumbers.push(i);
      }
      pageNumbers.push("...");
      pageNumbers.push(totalPages);
    }

    return pageNumbers;
  };

  const pageNumbers = getPageNumbers();

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      marginTop={4}
    >
      {/* <Button
        onClick={() => {
          onPageChange(1);
        }}
        disabled={currentPage === 1}
        mr={2}
      >
        First
      </Button> */}
      <Button
        onClick={() => {
          onPageChange(currentPage - 1);
        }}
        disabled={currentPage === 1}
        mr={2}
      >
        Previous
      </Button>
      {pageNumbers.map((pageNumber, index) =>
        pageNumber === "..." ? (
          <Text key={index} mx={1}>
            ...
          </Text>
        ) : (
          <Button
            key={index}
            onClick={() => {
              onPageChange(pageNumber as number);
            }}
            variant={currentPage === pageNumber ? "solid" : "outline"}
            mx={1}
          >
            {pageNumber}
          </Button>
        )
      )}
      <Button
        onClick={() => {
          onPageChange(currentPage + 1);
        }}
        disabled={currentPage === totalPages}
        ml={2}
      >
        Next
      </Button>
      {/* <Button
        onClick={() => {
          onPageChange(totalPages);
        }}
        disabled={currentPage === totalPages}
        ml={2}
      >
        Last
      </Button> */}
    </Box>
  );
}
