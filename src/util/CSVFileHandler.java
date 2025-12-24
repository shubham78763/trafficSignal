package util;

import java.io.*;
import java.util.ArrayList;
import java.util.List;

public class CSVFileHandler {
    
    public static void writeToFile(String filename, List<String> data) throws FileOperationException {
        FileWriter writer = null;
        BufferedWriter bufferedWriter = null;
        
        try {
            writer = new FileWriter(filename);
            bufferedWriter = new BufferedWriter(writer);
            
            for (String line : data) {
                
                bufferedWriter.write(line);
                
                bufferedWriter.newLine();
            }
            
            System.out.println("Data written to " + filename);
            
        } catch (IOException e) {
            throw new FileOperationException("Error writing to file: " + filename, e);
        } finally {
            try {
                if (bufferedWriter != null) {
                    bufferedWriter.close();
                }
                if (writer != null) {
                    writer.close();
                }
            } catch (IOException e) {
                System.err.println("Error closing file: " + e.getMessage());
            }
        }
    }
    
    public static List<String[]> readFromFile(String filename) throws FileOperationException {
        List<String[]> records = new ArrayList<>();
        FileReader reader = null;
        BufferedReader bufferedReader = null;
        
        try {
            File file = new File(filename);
            if (!file.exists()) {
                return records;
            }
            
            reader = new FileReader(file);
            bufferedReader = new BufferedReader(reader);
            
            String line;
            while ((line = bufferedReader.readLine()) != null) {
                String[] fields = line.split(",");
                records.add(fields);
            }
            
            System.out.println("Data read from " + filename);
            
        } catch (IOException e) {
            throw new FileOperationException("Error reading from file: " + filename, e);
        } finally {
            try {
                if (bufferedReader != null) {
                    bufferedReader.close();
                }
                if (reader != null) {
                    reader.close();
                }
            } catch (IOException e) {
                System.err.println("Error closing file: " + e.getMessage());
            }
        }
        
        return records;
    }
}


