import java.io.*;
import java.sql.*;
import java.util.*;

public class ImportarSinader {

    // ─── CONFIGURA AQUÍ TUS DATOS DE CONEXIÓN ───────────────────────
    static final String HOST     = "daterra.c7u4mm440l9t.us-east-2.rds.amazonaws.com";
    static final String PORT     = "3306";
    static final String DATABASE = "RETC";
    static final String USER     = "admin";
    static final String PASSWORD = "daterra123";
    // ────────────────────────────────────────────────────────────────

    static final String CSV_FILE = "C:/Users/Jose/Downloads/RETC_EXCEL/gm-sinader-2014-fixed (1).csv";
    static final String TABLE    = "SINADER_2014";
    static final int    BATCH    = 500;

    static final Set<String> COMMA_TO_DOT = new HashSet<>(Arrays.asList(
            "latitud", "longitud", "cantidad_toneladas",
            "id_vu_trazabilidad", "id_comuna_trazabilidad","id_vu"
    ));

    public static void main(String[] args) throws Exception {
        String url = "jdbc:mysql://" + HOST + ":" + PORT + "/" + DATABASE
                + "?useUnicode=true&characterEncoding=UTF-8&allowPublicKeyRetrieval=true&useSSL=false";

        try (Connection conn = DriverManager.getConnection(url, USER, PASSWORD);
             BufferedReader br = new BufferedReader(new InputStreamReader(
                     new FileInputStream(CSV_FILE), "UTF-8"))) {

            String headerLine = br.readLine();
            if (headerLine.startsWith("\uFEFF")) headerLine = headerLine.substring(1);
            String[] cols = headerLine.split(";");

            String placeholders = String.join(", ", Collections.nCopies(cols.length, "?"));
            String colNames     = String.join(", ", cols);
            String sql          = "INSERT INTO " + TABLE + " (" + colNames + ") VALUES (" + placeholders + ")";

            PreparedStatement ps = conn.prepareStatement(sql);
            conn.setAutoCommit(false);

            String line;
            int count = 0;

            while ((line = br.readLine()) != null) {
                String[] values = parseLine(line);
                for (int i = 0; i < cols.length; i++) {
                    String val = i < values.length ? values[i].trim() : "";
                    if (COMMA_TO_DOT.contains(cols[i])) {
                        val = val.replace(",", ".");
                    }
                    if (val.isEmpty()) {
                        ps.setNull(i + 1, Types.NULL);
                    } else {
                        ps.setString(i + 1, val);
                    }
                }
                ps.addBatch();
                count++;

                if (count % BATCH == 0) {
                    ps.executeBatch();
                    conn.commit();
                    System.out.println("  " + count + " filas insertadas...");
                }
            }

            ps.executeBatch();
            conn.commit();
            System.out.println("✅ Importación completada: " + count + " filas.");
        }
    }

    static String[] parseLine(String line) {
        List<String> result = new ArrayList<>();
        StringBuilder sb = new StringBuilder();
        boolean inQuotes = false;

        for (int i = 0; i < line.length(); i++) {
            char c = line.charAt(i);
            if (c == '"') {
                inQuotes = !inQuotes;
            } else if (c == ';' && !inQuotes) {
                result.add(sb.toString());
                sb.setLength(0);
            } else {
                sb.append(c);
            }
        }
        result.add(sb.toString());
        return result.toArray(new String[0]);
    }
}
